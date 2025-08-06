import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ContactUs() {
  return (
    <>
      <Breadcrumbs title="Contact Us" />
      <section className="bg-[#FFFDF5] pt-10 sm:py-20">
        <div className="container mx-auto">
          {/* Top Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* Phone */}
            <div className="flex flex-col lg:flex-row items-center  gap-4">
              <div className="sm:pl-6">
                <div className="w-[77px] h-[77px] rounded-[50px] bg-[#CDB04E] flex items-center justify-center shrink-0">
                  <Image
                    src="/images/phonenumber.svg"
                    alt="Phone"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className="font-josefin max-w-[278px] text-center lg:text-left">
                <h3 className="text-[#01292B] text-[20px] font-bold leading-[20px] mb-1">
                  Phone Number
                </h3>
                <p className="text-[#01292B] font-light text-sm leading-[22px]">
                  +91 123456789
                </p>
                <p className="text-[#01292B] font-light text-sm leading-[22px]">
                  +91 123456789
                </p>
              </div>
            </div>

            {/* Email */}
            <div className=" flex flex-col lg:flex-row items-center gap-4">
              <div className="sm:pl-6">
                <div className="w-[77px] h-[77px] rounded-[50px] bg-[#CDB04E] flex items-center justify-center shrink-0">
                  <Image
                    src="/images/emailid.svg"
                    alt="Email"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className="font-josefin max-w-[200px] lg:max-w-[278px] text-center lg:text-left">
                <h3 className="text-[#01292B] text-[20px] font-bold leading-[20px] mb-1">
                  Email ID
                </h3>
                <p className="text-[#01292B] font-light text-sm leading-[22px]">
                  demo@gmail.com
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="sm:pl-6">
                <div className="w-[77px] h-[77px] rounded-[50px] bg-[#CDB04E] flex items-center justify-center shrink-0">
                  <Image
                    src="/images/location1.svg"
                    alt="Location"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className="font-josefin max-w-[278px] text-center lg:text-left">
                <h3 className="text-[#01292B] text-[20px] font-bold leading-[20px] mb-1">
                  Location
                </h3>
                <p className="text-[#01292B] font-light text-sm leading-[22px]">
                  is simply dummy text of the printing and typesetting industry.
                  Lorem Ipsum ha s been the industry&apos;s standard dummy
                </p>
              </div>
            </div>
          </div>
          <div className="container mx-auto">
            <div className="container mx-auto relative flex flex-col sm:flex-row">
              <div className="sm:rounded-[20px] overflow-hidden bg-[#01292B] flex flex-col sm:flex-row w-full">
                {/* Map Section */}
                <div className="w-full sm:w-[514px] h-[200px] xs:h-[300px] sm:h-[666px] relative">
                  <Image
                    src="/images/map.webp"
                    alt="Map"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Form Section */}
                <div className="w-full sm:w-[746px] h-auto sm:h-[666px] px-4 xs:px-6 sm:px-12 pt-10 sm:pt-20 pb-10 flex flex-col justify-center rounded-[20px] bg-[#072D2C]">
                  <h2 className="font-cinzel text-white text-lg xs:text-xl sm:text-[40px] text-center sm:text-left font-bold sm:mb-3">
                    We Would Love To Hear <br />
                    <span className="text-[#CDB04E]">From You</span>
                  </h2>

                  <p className="text-center sm:text-left not-visited:text-white font-josefin text-xs xs:text-base sm:text-lg pt-4 sm:pt-5 pb-4 sm:pb-5 font-light mb-6 max-w-full sm:max-w-[517px]">
                    Feel free to reach out with any questions or feedback — we
                    are here to help!
                  </p>

                  <form className="space-y-4 font-josefin text-[14px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="text-primary block mb-1 font-normal"
                        >
                          Full Name
                        </label>
                        <input
                          id="name"
                          placeholder="Enter your full name"
                          className="w-full bg-transparent border border-[rgba(255,255,255,0.8)] text-white px-4 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="text-primary block mb-1 font-normal"
                        >
                          Phone No
                        </label>
                        <input
                          id="phone"
                          placeholder="Enter your phone no"
                          className="w-full bg-transparent border border-[rgba(255,255,255,0.8)] text-white px-4 py-2 rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-primary block mb-1 font-normal">
                          Country of Residence
                        </label>
                        <select
                          className="w-full bg-transparent border border-[#FFFFFFCC] text-white px-4 py-2 rounded focus:bg-background"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select your country
                          </option>
                          <option value="thailand">Thailand</option>
                          <option value="uae">UAE</option>
                          <option value="uk">UK</option>
                          <option value="usa">USA</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-primary block mb-1 font-normal">
                          Preferred Investment Location
                        </label>
                        <select
                          className="w-full bg-transparent border border-[#FFFFFFCC] text-white px-4 py-2 rounded focus:bg-background"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select your country
                          </option>
                          <option value="thailand">Thailand</option>
                          <option value="uae">UAE</option>
                          <option value="uk">UK</option>
                          <option value="usa">USA</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-primary block mb-1 font-normal">
                        Message (Optional)
                      </label>
                      <textarea
                        placeholder="Tell us about investment goals..."
                        className="w-full bg-transparent border border-[rgba(255,255,255,0.8)] text-white px-4 py-2 rounded min-h-[96px]"
                      />
                    </div>

                    <div className="flex justify-center items-center sm:justify-end">
                      <button
                        type="submit"
                        className="w-[132px] h-[40px] rounded-[10px] border border-[#233C30] bg-gradient-to-br from-[#C3912F] via-[#F5E7A8] to-[#C3912F] hover:bg-[#d8bc59] text-[#01292B] font-josefin font-semibold text-[14px] leading-[100%] text-center sm:text-left"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
