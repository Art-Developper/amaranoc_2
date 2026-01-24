"use client"

import { User, Globe, Search, Facebook, Instagram, Phone, Mail, Map } from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";


export default function Sales(){
    const pathName = usePathname();

  const linkClass = (path) =>
    `relative pb-1 transition-all
     ${pathName === path
      ? "after:w-full"
      : "after:w-0 hover:after:w-full"
    }
     after:content-['']
     after:absolute
     after:left-0
     after:bottom-0
     after:h-[1px]
     after:bg-orange-500
     after:transition-all
     after:duration-300`;
  return (
    <>
      <div className="flex justify-center items-center gap-74.5 my-7">
        <div className="flex items-start justify-start">
          <Link href="/">
            <img src="/logo.svg" alt="Logo" width="170" />
          </Link>
        </div>
        <div className="flex items-center justify-center gap-10">
          <Link className={linkClass("/")} href="/">Գլխավոր</Link>
          <Link className={linkClass("/sales")} href="/sales">Զեղչեր</Link>
          <Link className={linkClass("/service")} href="/service">Ծառայություններ</Link>
          <Link className={linkClass("/about_us")} href="/about_us">Մեր մասին</Link>
        </div>
        <div className="flex gap-5 justify-end items-center">
          <button>
            <Globe className="w-5 h-5" />
          </button>

          <button>
            <User className="w-5 h-5" />
          </button>

          <div className="relative">
            <input
              type="text"
              placeholder="Որոնում"
              className="pl-10 pr-2 py-2 border  rounded-3xl"
            />
            <Search className="w-4 h-4 absolute left-54 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className=" bg-[#101623ff] text-white">
        <div className="flex justify-center items-center">
          <h1 className="text-3xl my-4">ԿՈՆՏԱԿՏՆԵՐ</h1>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 p-4 bg-gray-900 text-white">
          <div className="flex items-center gap-2">
            <Phone size={20} />
            <span className="text-sm">041-611-611 / 044-611-611</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={20} />
            <span className="text-sm text-gray-300">AMARANOC.INFO@GMAIL.COM</span>
          </div>
          <a href="#" className="flex items-center gap-2">
            <Instagram size={20} />
            <span className="text-sm font-medium">AMARANOC.AM</span>
          </a>
          <a href="#" className="flex items-center gap-2">
            <Facebook size={20} />
            <span className="text-sm font-medium">AMARANOC.AM</span>
          </a>
          <div className="flex items-center gap-2">
            <MapPin size={20} />
            <span className="text-sm ">ԹՈՒՄԱՆՅԱՆ 5</span>
          </div>
        </div>
        <div className="flex justify-center my-3.5">
          <p className="underline">Գաղտնիության քաղաքականություն</p>
        </div>
        <div className="flex justify-center my-2.5">
          <p>Ամառանոց ՍՊԸ | Amaranoc LLC | Амараноц OOO</p>
        </div>
        <div>
          <Image
            src="/image/footer-background.webp"
            alt="footer image"
            width={1920}
            height={140}
          ></Image>
        </div>
      </div>
    </>
  );
}