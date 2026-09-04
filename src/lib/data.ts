import { addDays, subDays } from 'date-fns';

export type RiskLevel = 'Low' | 'Medium' | 'High';
export type AcquisitionStage = 'Initial Notification' | 'Survey' | 'Hearing of Objections' | 'Declaration' | 'Award Enquiry' | 'Taking Possession';

export interface Parcel {
  id: string;
  surveyNumber: string;
  village: string;
  district: string;
  state: string;
  areaAcres: number;
  landOwner: string;
  numberOfOwners: number;
  ownershipVerificationStatus: 'Verified' | 'Pending' | 'Disputed';
  documentationStatus: 'Complete' | 'Incomplete';
  compensationStatus: 'Paid' | 'Pending' | 'Disputed';
  legalDisputeStatus: 'None' | 'Active Case' | 'Resolved';
  objectionStatus: 'None' | 'Filed' | 'Resolved';
  approvalStatus: 'Approved' | 'Pending';
  encroachmentStatus: 'None' | 'Minor' | 'Major';
  currentAcquisitionStage: AcquisitionStage;
  acquisitionStartDate: string;
  expectedCompletionDate: string;
  // AI Predictions
  riskScore: number;
  riskLevel: RiskLevel;
  delayProbability: number;
  predictedDelayDays: number;
  topRiskFactors: { factor: string; contribution: number }[];
  recommendedAction: string;
  // GIS Data
  lat: number;
  lng: number;
}

const VILLAGES = ['Bhosari', 'Chinchwad', 'Wakad', 'Hinjewadi', 'Tathawade', 'Baner', 'Aundh', 'Pashan'];
const DISTRICTS = ['Pune', 'Satara', 'Sangli', 'Kolhapur'];
const STATES = ['Maharashtra'];
const FIRST_NAMES = ['Rahul', 'Amit', 'Priya', 'Sneha', 'Vikram', 'Anjali', 'Rohan', 'Kavita', 'Suresh', 'Ramesh', 'Prakash', 'Sunita', 'Nitin', 'Meena', 'Deepak'];
const LAST_NAMES = ['Deshmukh', 'Patil', 'Joshi', 'Kulkarni', 'Pawar', 'Shinde', 'Jadhav', 'Gaikwad', 'Kale', 'Bhosale'];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateName(): string {
  return `${randomChoice(FIRST_NAMES)} ${randomChoice(LAST_NAMES)}`;
}

export function generateSyntheticParcels(count: number = 850): Parcel[] {
  const parcels: Parcel[] = [];
  // Base coordinates around Pune, Maharashtra
  const baseLat = 18.5204;
  const baseLng = 73.8567;

  for (let i = 1; i <= count; i++) {
    const isDisputed = Math.random() > 0.8; // 20% chance of dispute
    const isIncomplete = Math.random() > 0.7;
    const hasEncroachment = Math.random() > 0.85;
    const compensationPending = Math.random() > 0.6;
    const approvalPending = Math.random() > 0.75;
    
    let riskScore = 10;
    const riskFactors: { factor: string; contribution: number }[] = [];
    
    if (isDisputed) {
      riskScore += 35;
      riskFactors.push({ factor: 'Ownership dispute / Legal Case', contribution: 35 });
    }
    if (compensationPending) {
      riskScore += 25;
      riskFactors.push({ factor: 'Compensation pending', contribution: 25 });
    }
    if (isIncomplete) {
      riskScore += 15;
      riskFactors.push({ factor: 'Missing documents', contribution: 15 });
    }
    if (approvalPending) {
      riskScore += 10;
      riskFactors.push({ factor: 'Approval pending', contribution: 10 });
    }
    if (hasEncroachment) {
      riskScore += 10;
      riskFactors.push({ factor: 'Encroachment', contribution: 10 });
    }
    
    riskScore = Math.min(100, riskScore + randomInt(0, 5));
    
    let riskLevel: RiskLevel = 'Low';
    let delayProbability = randomInt(5, 20);
    let predictedDelayDays = 0;
    let recommendedAction = 'Continue standard process.';
    
    if (riskScore > 75) {
      riskLevel = 'High';
      delayProbability = riskScore;
      predictedDelayDays = randomInt(30, 180);
      if (isDisputed) recommendedAction = 'Escalate parcel for legal review and initiate dispute-resolution workflow.';
      else if (compensationPending) recommendedAction = 'Prioritize compensation verification and processing.';
      else recommendedAction = 'Immediate intervention required by District Magistrate.';
    } else if (riskScore > 40) {
      riskLevel = 'Medium';
      delayProbability = riskScore;
      predictedDelayDays = randomInt(10, 45);
      if (isIncomplete) recommendedAction = 'Request missing documents from the concerned party.';
      else if (approvalPending) recommendedAction = 'Notify the responsible administrative department for fast-tracking.';
      else recommendedAction = 'Monitor closely for further delays.';
    }
    
    // Normalize risk factors out of 100% of the risk
    const totalRiskAssigned = riskFactors.reduce((acc, curr) => acc + curr.contribution, 0);
    if (totalRiskAssigned > 0) {
       riskFactors.forEach(rf => {
         rf.contribution = Math.round((rf.contribution / totalRiskAssigned) * 100);
       });
    } else {
       riskFactors.push({ factor: 'Standard processing time', contribution: 100 });
    }

    const startDate = subDays(new Date(), randomInt(30, 365));
    const expectedEndDate = addDays(startDate, randomInt(180, 400));
    
    parcels.push({
      id: `LA-MH-${2000 + i}`,
      surveyNumber: `SY-${randomInt(10, 99)}/${randomInt(1, 9)}`,
      village: randomChoice(VILLAGES),
      district: randomChoice(DISTRICTS),
      state: STATES[0],
      areaAcres: parseFloat(randomFloat(0.5, 5.0).toFixed(2)),
      landOwner: generateName(),
      numberOfOwners: randomInt(1, 3),
      ownershipVerificationStatus: isDisputed ? 'Disputed' : (Math.random() > 0.2 ? 'Verified' : 'Pending'),
      documentationStatus: isIncomplete ? 'Incomplete' : 'Complete',
      compensationStatus: compensationPending ? 'Pending' : (Math.random() > 0.9 ? 'Disputed' : 'Paid'),
      legalDisputeStatus: isDisputed ? 'Active Case' : 'None',
      objectionStatus: Math.random() > 0.8 ? 'Filed' : 'None',
      approvalStatus: approvalPending ? 'Pending' : 'Approved',
      encroachmentStatus: hasEncroachment ? 'Major' : 'None',
      currentAcquisitionStage: randomChoice(['Initial Notification', 'Survey', 'Hearing of Objections', 'Declaration', 'Award Enquiry', 'Taking Possession']),
      acquisitionStartDate: startDate.toISOString(),
      expectedCompletionDate: expectedEndDate.toISOString(),
      riskScore,
      riskLevel,
      delayProbability,
      predictedDelayDays,
      topRiskFactors: riskFactors.sort((a, b) => b.contribution - a.contribution),
      recommendedAction,
      lat: baseLat + randomFloat(-0.2, 0.2),
      lng: baseLng + randomFloat(-0.2, 0.2),
    });
  }
  return parcels;
}

export const staticParcels = generateSyntheticParcels(850);
