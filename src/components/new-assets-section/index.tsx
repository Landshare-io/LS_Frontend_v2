import Image from "next/image";
import Link from "next/link";
import Button from "../common/button";

export default function NewAssetsSection() {
  return (
    <div className="bg-[#f9fafb] dark:bg-[#0a0f0a] py-[60px] md:py-[80px] px-[20px] md:px-[40px]">
      <div className="max-w-[1200px] mx-auto">
        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] mb-[60px]">
          {/* Property Card 1 */}
          <div className="bg-white dark:bg-[#1a1f1a] rounded-[12px] overflow-hidden shadow-sm">
            <div className="relative h-[200px] bg-gray-200">
              <Image 
                src="/img/real-house/house-placeholder.jpg" 
                alt="Property" 
                fill
                className="object-cover"
              />
            </div>
            <div className="p-[20px]">
              <div className="text-[14px] text-gray-500 dark:text-gray-400 mb-[8px]">
                3214 Sherman Rd, Cleveland Heights OH
              </div>
              <div className="grid grid-cols-3 gap-[12px] mb-[16px]">
                <div>
                  <div className="text-[12px] text-gray-500 dark:text-gray-400">Property Value</div>
                  <div className="text-[16px] font-bold">$125,000</div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-500 dark:text-gray-400">Rental Yield</div>
                  <div className="text-[16px] font-bold">9.32%</div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-500 dark:text-gray-400">Ann. Return</div>
                  <div className="text-[16px] font-bold">12.22%</div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-[16px]">
                <div className="px-[12px] py-[4px] bg-[#e8f5e9] dark:bg-[#1a3a1a] text-[#2e7d32] dark:text-[#66bb6a] rounded-[6px] text-[12px]">
                  Single Family
                </div>
                <div className="flex items-center gap-[8px] text-[14px] text-gray-600 dark:text-gray-300">
                  <span>🛏️ 2</span>
                  <span>🛁 1</span>
                </div>
              </div>
              <div className="bg-[#e8f5e9] dark:bg-[#1a3a1a] rounded-[8px] px-[16px] py-[12px] text-center">
                <div className="text-[14px] font-bold text-[#2e7d32] dark:text-[#66bb6a]">
                  LSRWA Holders Earn
                </div>
                <div className="text-[20px] font-bold text-[#2e7d32] dark:text-[#66bb6a]">
                  $11,648
                </div>
              </div>
            </div>
          </div>

          {/* Property Card 2 */}
          <div className="bg-white dark:bg-[#1a1f1a] rounded-[12px] overflow-hidden shadow-sm">
            <div className="relative h-[200px] bg-gray-200">
              <Image 
                src="/img/real-house/house-placeholder.jpg" 
                alt="Property" 
                fill
                className="object-cover"
              />
            </div>
            <div className="p-[20px]">
              <div className="text-[14px] text-gray-500 dark:text-gray-400 mb-[8px]">
                817 12th Ave N, Fargo ND
              </div>
              <div className="grid grid-cols-3 gap-[12px] mb-[16px]">
                <div>
                  <div className="text-[12px] text-gray-500 dark:text-gray-400">Property Value</div>
                  <div className="text-[16px] font-bold">$219,000</div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-500 dark:text-gray-400">Rental Yield</div>
                  <div className="text-[16px] font-bold">5.43%</div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-500 dark:text-gray-400">Ann. Return</div>
                  <div className="text-[16px] font-bold">8.33%</div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-[16px]">
                <div className="px-[12px] py-[4px] bg-[#e8f5e9] dark:bg-[#1a3a1a] text-[#2e7d32] dark:text-[#66bb6a] rounded-[6px] text-[12px]">
                  Single Family
                </div>
                <div className="flex items-center gap-[8px] text-[14px] text-gray-600 dark:text-gray-300">
                  <span>🛏️ 3</span>
                  <span>🛁 2</span>
                </div>
              </div>
              <div className="bg-[#e8f5e9] dark:bg-[#1a3a1a] rounded-[8px] px-[16px] py-[12px] text-center">
                <div className="text-[14px] font-bold text-[#2e7d32] dark:text-[#66bb6a]">
                  LSRWA Holders Earn
                </div>
                <div className="text-[20px] font-bold text-[#2e7d32] dark:text-[#66bb6a]">
                  $11,902
                </div>
              </div>
            </div>
          </div>

          {/* Property Card 3 */}
          <div className="bg-white dark:bg-[#1a1f1a] rounded-[12px] overflow-hidden shadow-sm">
            <div className="relative h-[200px] bg-gray-200">
              <Image 
                src="/img/real-house/house-placeholder.jpg" 
                alt="Property" 
                fill
                className="object-cover"
              />
            </div>
            <div className="p-[20px]">
              <div className="text-[14px] text-gray-500 dark:text-gray-400 mb-[8px]">
                7751 Mallard Drive, St Louis MO
              </div>
              <div className="grid grid-cols-3 gap-[12px] mb-[16px]">
                <div>
                  <div className="text-[12px] text-gray-500 dark:text-gray-400">Property Value</div>
                  <div className="text-[16px] font-bold">$120,671</div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-500 dark:text-gray-400">Rental Yield</div>
                  <div className="text-[16px] font-bold">7.23%</div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-500 dark:text-gray-400">Ann. Return</div>
                  <div className="text-[16px] font-bold">10.13%</div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-[16px]">
                <div className="px-[12px] py-[4px] bg-[#e8f5e9] dark:bg-[#1a3a1a] text-[#2e7d32] dark:text-[#66bb6a] rounded-[6px] text-[12px]">
                  Single Family
                </div>
                <div className="flex items-center gap-[8px] text-[14px] text-gray-600 dark:text-gray-300">
                  <span>🛏️ 2</span>
                  <span>🛁 1</span>
                </div>
              </div>
              <div className="bg-[#e8f5e9] dark:bg-[#1a3a1a] rounded-[8px] px-[16px] py-[12px] text-center">
                <div className="text-[14px] font-bold text-[#2e7d32] dark:text-[#66bb6a]">
                  LSRWA Holders Earn
                </div>
                <div className="text-[20px] font-bold text-[#2e7d32] dark:text-[#66bb6a]">
                  $8,728
                </div>
              </div>
            </div>
          </div>

          {/* Property Card 4 */}
          <div className="bg-white dark:bg-[#1a1f1a] rounded-[12px] overflow-hidden shadow-sm">
            <div className="relative h-[200px] bg-gray-200">
              <Image 
                src="/img/real-house/house-placeholder.jpg" 
                alt="Property" 
                fill
                className="object-cover"
              />
            </div>
            <div className="p-[20px]">
              <div className="text-[14px] text-gray-500 dark:text-gray-400 mb-[8px]">
                14670 Wisconsin Ave, Lakewood OH
              </div>
              <div className="grid grid-cols-3 gap-[12px] mb-[16px]">
                <div>
                  <div className="text-[12px] text-gray-500 dark:text-gray-400">Property Value</div>
                  <div className="text-[16px] font-bold">$116,000</div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-500 dark:text-gray-400">Rental Yield</div>
                  <div className="text-[16px] font-bold">10.81%</div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-500 dark:text-gray-400">Ann. Return</div>
                  <div className="text-[16px] font-bold">11.81%</div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-[16px]">
                <div className="px-[12px] py-[4px] bg-[#e8f5e9] dark:bg-[#1a3a1a] text-[#2e7d32] dark:text-[#66bb6a] rounded-[6px] text-[12px]">
                  Single Family
                </div>
                <div className="flex items-center gap-[8px] text-[14px] text-gray-600 dark:text-gray-300">
                  <span>🛏️ 3</span>
                  <span>🛁 2</span>
                </div>
              </div>
              <div className="bg-[#e8f5e9] dark:bg-[#1a3a1a] rounded-[8px] px-[16px] py-[12px] text-center">
                <div className="text-[14px] font-bold text-[#2e7d32] dark:text-[#66bb6a]">
                  LSRWA Holders Earn
                </div>
                <div className="text-[20px] font-bold text-[#2e7d32] dark:text-[#66bb6a]">
                  $12,537
                </div>
              </div>
            </div>
          </div>

          {/* New Assets Coming Soon Section */}
          <div className="bg-white dark:bg-[#1a1f1a] rounded-[12px] overflow-hidden shadow-sm flex flex-col justify-center items-center p-[40px] lg:col-span-2">
            <h2 className="text-[32px] md:text-[40px] font-bold text-center mb-[24px]">
              <span className="text-gray-900 dark:text-white">New Assets</span>{" "}
              <span className="text-gray-900 dark:text-white">Coming Soon</span>
            </h2>
            <p className="text-[16px] md:text-[18px] text-gray-600 dark:text-gray-300 text-center max-w-[600px] mb-[32px] leading-relaxed">
              Landshare v2 enables an Index-Style Expansion for LSRWA token. Rather than strictly onboarding assets from scratch, we can now integrate already-tokenized, compliant assets from reputable partners.
            </p>
            <Link href="https://docs.landshare.io/platform-features/landshare-rwa-token-lsrwa">
              <Button className="bg-primary-green text-white px-[32px] py-[14px] rounded-[100px] hover:bg-green-600 transition-colors">
                Learn more about V2
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
