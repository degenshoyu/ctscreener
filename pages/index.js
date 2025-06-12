import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Topbar from "@/components/Topbar";
import TokenSearchBox from "@/components/TokenSearchBox";
import TokenInfoCard from "@/components/TokenInfoCard";
import TweetList from "@/components/TweetList";

export default function HomePage() {
  const [earliestTweets, setEarliestTweets] = useState([]);
  const [address, setAddress] = useState("");
  const [activeTab, setActiveTab] = useState("earliest");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [tweets, setTweets] = useState([]);

  return (
    <DashboardLayout>
      <div className="text-white px-4 py-8">
        <Topbar />
        <h1 className="text-3xl font-bold mb-2">Coin Analyst</h1>
        <p className="text-gray-400 mb-6">
          Discover early callers of winning coins.
        </p>

        <div className="flex items-center gap-4 max-w-xl">
          <TokenSearchBox
            address={address}
            setAddress={setAddress}
            onTokenInfo={setTokenInfo}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onTweets={setTweets}
          />
        </div>

        <div className="mt-6 max-w-xl">
          <RadioGroup
            value={activeTab}
            onValueChange={(val) => setActiveTab(val)}
            className="flex gap-6"
          >
            <TooltipProvider>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="earliest" id="r1" />
                <label htmlFor="r1" className="text-sm text-gray-300">
                  Early callers
                </label>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shiller" id="r2" disabled />
                    <label htmlFor="r2" className="text-sm text-gray-500">
                      Top shillers (24h / 7d / 30d)
                    </label>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="text-sm font-semibold bg-yellow-500 text-black px-3 py-2 rounded-md shadow-lg"
                >
                  🚧 Coming soon
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="significant" id="r3" disabled />
                    <label htmlFor="r3" className="text-sm text-gray-500">
                      High-impact callers
                    </label>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="text-sm font-semibold bg-yellow-500 text-black px-3 py-2 rounded-md shadow-lg"
                >
                  🚧 Coming soon
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </RadioGroup>
        </div>

        {tokenInfo && (
          <div className="mt-6">
            <TokenInfoCard tokenInfo={tokenInfo} />
          </div>
        )}

        {isLoading && (
          <div className="mt-4 max-w-xl">
            <div className="flex items-center text-gray-400 mb-4">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span>Scanning tweets related to this token... This may take up to a minute.</span>
            </div>
          </div>
        )}
        {tweets.length > 0 && (
          <div className="mt-6 max-w-xl">
            <TweetList tweets={tweets} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
