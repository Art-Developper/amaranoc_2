"use client"

import { User, Globe, Search, Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";


export default function Sales() {
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

      <div className="bg-black text-white flex justify-center w-auto ">
        <div className=" border-1 rounded-2xl  mx-auto my-16  max-w-6xl w-full flex flex-wrap justify-center">
          <div className="flex justify-center items-center gap-8 px-10 pt-20">
            <div className="w-60 h-0.5 bg-white"></div>
            <div><h1 className="text-3xl">ՏԵՂԱԴՐԵԼ ՀԱՅՏԱՐԱՐՈՒԹՅՈՒՆ</h1></div>
            <div className="w-60 h-0.5 bg-white"></div>
          </div>
          <div className="flex justify-center pt-6">
            <p>Մուտքագրեք Ձեր տվյալները նշված դաշտերում և մենք կկապնվենք Ձեզ հետ</p>
          </div>
          <div className="flex justify-center items-center gap-4 pt-6 pb-20">
            <input
              type="text"
              placeholder="Անուն Ազգանուն"
              className="border-1 rounded-2xl  px-10 py-2 w-full"
            ></input>
            <input
              type="phone"
              placeholder="Հեռախոահամար"
              className="border-1 rounded-2xl  px-10 py-2 w-full"
            >
            </input>
            <input
              type="mail"
              placeholder="Էլ․ Հասցե"
              className="border-1 rounded-2xl  px-10 py-2 w-full"
            >
            </input>
            <button
              className="border-1 border-orange-400 rounded-3xl px-6 py-2 bg-orange-400"
            >Ուղարկել</button>
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