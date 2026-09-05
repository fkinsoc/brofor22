import React from "react";
import AppLayout from "../components/Layout";
import { motion } from "motion/react";
import { ShieldCheck, FileText, Lock } from "lucide-react";
export default function LegalPage() {
  return (
    <AppLayout>
      {" "}
      <div className="max-w-4xl mx-auto py-8">
        {" "}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {" "}
          <h1 className="text-3xl font-light tracking-tight text-transparent bg-clip-text from-text-primary to-text-secondary dark:from-white dark:">
            Legal & Privacy
          </h1>{" "}
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            {" "}
            Official policies and terms of service for the Bro Foresee
            application, operated by Brown's Squad.{" "}
          </p>{" "}
        </motion.div>{" "}
        <div className="space-y-8">
          {" "}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-background-secondary dark:bg-[#111111]/80 border border-border-subtle dark:border-zinc-300 dark:border-zinc-700 rounded-none p-6"
          >
            {" "}
            <div className="flex items-center gap-3 mb-4">
              {" "}
              <div className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-none">
                {" "}
                <FileText className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />{" "}
              </div>{" "}
              <h2 className="text-xl font-medium text-text-primary dark:text-white">
                Terms of Use
              </h2>{" "}
            </div>{" "}
            <div className="prose prose-sm dark:prose-invert prose-zinc max-w-none text-zinc-600 dark:text-zinc-400">
              {" "}
              <p>
                Welcome to Bro Foresee, a predictive AI engine for land
                acquisition management.
              </p>{" "}
              <p>
                {" "}
                By accessing this platform, you agree to be bound by these
                terms. This application is operated by{" "}
                <strong>Brown's Squad</strong>. All data, predictions, and
                models provided by this platform are for decision support only
                and do not constitute binding legal or financial advice.{" "}
              </p>{" "}
              <h3 className="text-text-primary dark:text-white mt-4 font-bold">
                1. Access and Permissions
              </h3>{" "}
              <p>
                {" "}
                Access to the platform is strictly controlled. Supreme
                administrators (such as klassic.ig@gmail.com) reserve the right
                to revoke or grant access to any operator. You may not share
                your credentials or bypass access controls.{" "}
              </p>{" "}
              <h3 className="text-text-primary dark:text-white mt-4 font-bold">
                2. Usage Guidelines
              </h3>{" "}
              <p>
                {" "}
                You must not misuse the system by submitting false parcel data,
                abusing AI generation limits, or attempting to extract
                proprietary source code or predictive models.{" "}
              </p>{" "}
            </div>{" "}
          </motion.div>{" "}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-background-secondary dark:bg-[#111111]/80 border border-border-subtle dark:border-zinc-300 dark:border-zinc-700 rounded-none p-6"
          >
            {" "}
            <div className="flex items-center gap-3 mb-4">
              {" "}
              <div className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-none">
                {" "}
                <ShieldCheck className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />{" "}
              </div>{" "}
              <h2 className="text-xl font-medium text-text-primary dark:text-white">
                Privacy Policy
              </h2>{" "}
            </div>{" "}
            <div className="prose prose-sm dark:prose-invert prose-zinc max-w-none text-zinc-600 dark:text-zinc-400">
              {" "}
              <p>
                <strong>Brown's Squad</strong> is committed to protecting your
                organizational data and privacy.
              </p>{" "}
              <p>
                {" "}
                All data uploaded to the platform, including geographical
                coordinates, ownership records, and risk assessments, are
                processed ephemerally during AI analysis. We do not use your
                private land acquisition data to train public models.{" "}
              </p>{" "}
              <h3 className="text-text-primary dark:text-white mt-4 font-bold">
                Data Storage
              </h3>{" "}
              <p>
                {" "}
                Information is securely persisted in isolated Firestore
                instances. Security rules ensure that only authenticated
                operators within your organization can view or modify
                records.{" "}
              </p>{" "}
            </div>{" "}
          </motion.div>{" "}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-background-secondary dark:bg-[#111111]/80 border border-border-subtle dark:border-zinc-300 dark:border-zinc-700 rounded-none p-6"
          >
            {" "}
            <div className="flex items-center gap-3 mb-4">
              {" "}
              <div className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-none">
                {" "}
                <Lock className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />{" "}
              </div>{" "}
              <h2 className="text-xl font-medium text-text-primary dark:text-white">
                Legal Disclaimer
              </h2>{" "}
            </div>{" "}
            <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {" "}
              <p>
                {" "}
                The predictive delays and risk scores generated by the AI engine
                are estimations based on historical patterns and current
                systemic bottlenecks. <strong>Brown's Squad</strong> accepts no
                liability for project delays, financial losses, or legal
                disputes arising from decisions made based on this platform's
                automated insights.{" "}
              </p>{" "}
            </div>{" "}
          </motion.div>{" "}
        </div>{" "}
      </div>{" "}
    </AppLayout>
  );
}
