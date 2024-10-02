import React from "react";
// import { IconComponentNode } from "./IconComponentNode";

export const WelcomeScreen = () => {
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-[390px] h-[844px] relative">
        <div className="absolute w-[390px] h-[619px] top-0 left-0">
          <div className="absolute w-[390px] h-[33px] top-0 left-0">
            <div className="inline-flex items-center gap-1 absolute top-2.5 left-[305px]">
              {/* <Light className="!relative !w-5 !h-3.5" /> */}
              {/* <IconComponentNode className="!relative !w-4 !h-3.5" /> */}
              {/* <Light1 className="!relative !w-[25px] !h-3.5" /> */}
            </div>
            <img className="absolute w-14 h-[21px] top-1.5 left-[17px]" alt="Time light" src={"/assets/Overlay.png"} />
          </div>
          <img className="absolute w-[390px] h-[565px] top-0 left-0" alt="main-image" src={"/assets/image.png"} />
          <div className="absolute w-[390px] h-[193px] top-[372px] left-0 [background:linear-gradient(180deg,rgba(255,255,255,0)_0%,rgb(255,255,255)_100%)]" />
          <div className="absolute w-[71px] h-3.5 top-[576px] left-[244px] bg-[#00a3e433]" />
          <p className="absolute w-[270px] top-[563px] left-[60px] [font-family:'Sora-ExtraBold',Helvetica] font-extrabold text-[#192126] text-[22px] text-center tracking-[0] leading-[normal]">
            Transform Your Health, Unlock Your Potential
          </p>
        </div>
        <p className="absolute w-[272px] top-[639px] left-[59px] [font-family:'Sora-Regular',Helvetica] font-normal text-[#6a6a6a] text-sm text-center tracking-[0] leading-[normal]">
          Learn with fitness experts, at your own pace, and 100% updated content.
        </p>
        <button className="all-[unset] box-border absolute w-[361px] h-14 top-[720px] left-4">
          <div className="relative w-[359px] h-14 bg-[#00a3e4] rounded-xl">
            <div className="absolute top-4 left-[131px] [font-family:'Sora-Bold',Helvetica] font-bold text-white text-base text-center tracking-[0] leading-6 whitespace-nowrap">
              Get Started
            </div>
          </div>
        </button>
        <p className="absolute h-[18px] top-[799px] left-[90px] [font-family:'Sora-Regular',Helvetica] font-normal text-transparent text-sm text-center tracking-[0.14px] leading-[14px]">
          <span className="text-[#191919] tracking-[0.02px]">Already have account?</span>
          <span className="text-black tracking-[0.02px]">&nbsp;</span>
          <span className="[font-family:'Sora-SemiBold',Helvetica] font-semibold text-[#007cb7] tracking-[0.02px] leading-[18px] underline">
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};
