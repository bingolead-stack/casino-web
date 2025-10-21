"use"

import { IPromotionCardProps } from "./data";

export default function PromotionCard({title, description, imageUrl, action, link}: IPromotionCardProps) {
  return (
    <div
      className="w-full aspect-[2/1] rounded-lg shadow-md overflow-hidden flex flex-col justify-between"
      style={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.002), rgba(255, 255, 255, 0.002)), 
                     linear-gradient(159.38deg, rgba(26, 29, 38, 0) 23.6%, rgba(255, 24, 232, 0.2) 100%)`,
        boxShadow: '0px 3px 8px 0px #FFFFFF1F inset',
      }}
    >
      <div className="flex flex-row h-full p-3 md:p-6">
        {/* Left Part */}
        <div className="flex flex-col w-1/2 justify-center p-1 md:p-2 gap-1 md:gap-2">
						<h2 className="text-[#BD59FF] font-outfit font-extrabold text-xl md:text-3xl leading-[18px] md:leading-[35px] tracking-[-0.78px] align-middle">
						{title}
						</h2>
						<p className="text-[#67738F] mt-2 font-outfit font-extrabold text-md md:text-xl leading-none tracking-[-0.78px] align-middle uppercase">
							{description}
						</p>
						<button className="btn btn-primary mt-auto text-[14px] md:text-[20px] w-[146px] md:w-[188px]">
									{action}
						</button>
        </div>
        {/* Right Part */}
        <div className="w-1/2 m-4 md:m-6">
          <img
            src={imageUrl}
            alt="Promotion"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
