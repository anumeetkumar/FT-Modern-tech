import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";



const SubscriptionBanner = () => {
  const [showLicenseBanner, setShowLicenseBanner] = useState(true);

  return (
    <AnimatePresence>
      {showLicenseBanner && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mb-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <VerifiedUserOutlinedIcon className="mt-0.5 h-5 w-5 text-neutral-800 dark:text-neutral-300" />
              <div>
                <h3 className="text-sm font-semibold dark:text-neutral-100">
                  You are using the Freemium version
                </h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  Unlock enterprise features, unlimited scale, and dedicated
                  support. Activate your license to remove restrictions and
                  enable deployment automation.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button className="rounded-xl border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white dark:border-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-900">
                    Activate License
                  </button>
                  <button className="rounded-xl border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800">
                    Compare Plans
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowLicenseBanner(false)}
              className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              aria-label="Dismiss"
            >
              <CloseRoundedIcon />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionBanner;
