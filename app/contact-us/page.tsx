import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ContactUs() {
  return (
    <>
      <Breadcrumbs title="Contact Us" />
      <section className="bg-[#FFFDF5] py-20">
        <div className="container mx-auto px-4">
 {/* Top Info Section */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
  {/* Phone */}
  <div className="flex items-center gap-4">
    <div className="pl-6">
      <div className="w-[77px] h-[77px] rounded-[50px] bg-[#CDB04E] flex items-center justify-center shrink-0">
        <Image src="/images/phonenumber.svg" alt="Phone" width={20} height={20} />
      </div>
    </div>
    <div className="max-w-[278px]">
      <h3 className="text-[#01292B] text-[16px] font-bold leading-[20px] mb-1">
        Phone Number
      </h3>
      <p className="text-[#01292B] text-sm leading-[22px]">
        +91 123456789
      </p>
    </div>
  </div>

  {/* Email */}
  <div className="flex items-center gap-4">
    <div className="pl-6">
      <div className="w-[77px] h-[77px] rounded-[50px] bg-[#CDB04E] flex items-center justify-center shrink-0">
        <Image src="/images/emailid.svg" alt="Email" width={20} height={20} />
      </div>
    </div>
    <div className="max-w-[278px]">
      <h3 className="text-[#01292B] text-[16px] font-bold leading-[20px] mb-1">
        Email ID
      </h3>
      <p className="text-[#01292B] text-sm leading-[22px]">
        demo@gmail.com
      </p>
    </div>
  </div>

  {/* Location */}
  <div className="flex items-center gap-4">
    <div className="pl-6">
      <div className="w-[77px] h-[77px] rounded-[50px] bg-[#CDB04E] flex items-center justify-center shrink-0">
        <Image src="/images/location1.svg" alt="Location" width={20} height={20} />
      </div>
    </div>
    <div className="max-w-[278px]">
      <h3 className="text-[#01292B] text-[16px] font-bold leading-[20px] mb-1">
        Location
      </h3>
      <p className="text-[#01292B] text-sm leading-[22px]">
        Bangkok, Thailand
      </p>
    </div>
  </div>
</div>


       {/* Form & Map */}
<div className="bg-[#01292B] rounded-[10px] overflow-hidden p-0 lg:flex">
  {/* Map */}
  <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
    <div className="w-[514px] h-[666px] rounded-[20px] overflow-hidden">
      <Image
        src="/images/map.webp"
        alt="Map"
        width={514}
        height={666}
        className="w-full h-full object-cover"
      />
    </div>
  </div>

  {/* Form */}
  <div className="w-full lg:w-1/2 p-6 lg:p-12 flex flex-col justify-center">
    <h2 className="text-white text-[24px] md:text-[30px] lg:text-[32px] font-bold leading-tight mb-3">
      We Would Love To Hear <br />
      <span className="text-[#CDB04E]">From You</span>
    </h2>
    <p className="text-white text-sm mb-6 max-w-md">
      Feel free to reach out with any questions or feedback – we’re here to help!
    </p>

    <form className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="text-white block mb-1">Full Name</label>
          <input
            id="name"
            placeholder="Enter your full name"
            className="w-full bg-transparent border border-[#CDB04E] text-white placeholder-white px-4 py-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-white block mb-1">Phone No</label>
          <input
            id="phone"
            placeholder="Enter your phone no"
            className="w-full bg-transparent border border-[#CDB04E] text-white placeholder-white px-4 py-2 rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-white block mb-1">Country of Residence</label>
          <select className="w-full bg-transparent border border-[#CDB04E] text-white px-4 py-2 rounded">
            <option>Select your country</option>
            <option>Thailand</option>
            <option>UAE</option>
            <option>UK</option>
            <option>USA</option>
          </select>
        </div>
        <div>
          <label className="text-white block mb-1">Preferred Investment Location</label>
          <select className="w-full bg-transparent border border-[#CDB04E] text-white px-4 py-2 rounded">
            <option>Thailand (Phuket)</option>
            <option>Thailand (Bangkok)</option>
            <option>UAE (Dubai)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-white block mb-1">Message (Optional)</label>
        <textarea
          placeholder="Tell us about investment goals..."
          className="w-full bg-transparent border border-[#CDB04E] text-white placeholder-white px-4 py-2 rounded min-h-[96px]"
        />
      </div>

      <button
        type="submit"
        className="bg-[#CDB04E] hover:bg-[#d8bc59] text-black font-bold text-[15px] px-8 py-3 rounded"
      >
        Submit
      </button>
    </form>
  </div>
</div>

          </div>
       
      </section>
    </>
  );
}
