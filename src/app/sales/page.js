"use client"

import React, { useState } from "react";
import { User, Globe, Search, Facebook, Instagram, Phone, Mail, MapPin, Heart, CheckCircle2, X, Star, Users } from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";

export default function Sales() {
  const pathName = usePathname();

  const [selectedPrice, setSelectedPrice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [formData, setFormData] = useState({ recipientName: '', phoneNumber: '' });

  const discounts = [
    {
      percent: "-15%",
      title: "2 կամ ավել ամրագրումի օրերի դեպքում",
      desc: "Ստացեք 5-15% զեղչ կախված ամրագրումի 3-ից մինիմում 20 օր:",
      img: "https://amaranoc.am/images/raffle/special-discounts-image.jpg",
    },
    {
      percent: "-10%",
      title: "Անձնական Reel-ի հրապարակման դեպքում",
      desc: "Կիսվել մեր հյուրանոցում ձեր արձակուրդի օրերից՝ նշելով amaranoc.am և ստացեք 10% զեղչ:",
      img: "https://amaranoc.am/images/raffle/special-discounts-image.jpg",
    },
    {
      percent: "-5%",
      title: "2-րդ այցելության դեպքում",
      desc: "Վերադարձի դեպքում ստացեք 5% զեղչ 3-րդ ամրագրումի դեպքում:",
      img: "https://amaranoc.am/images/raffle/special-discounts-image.jpg",
    },
  ];

  const prices = ["50,000 ֏", "60,000 ֏", "70,000 ֏", "80,000 ֏", "90,000 ֏", "100,000 ֏"];

  const houses = [
    { id: 1, image: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1759149473223--0.33907271602966693image.webp&w=1920&q=75", location: "Բջնի", price: "40,000֏", people: "4-6", rating: "4.8" },
    { id: 2, image: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1753697519352--0.8706588573375771image.webp&w=1920&q=75", location: "Օհանավան", price: "75,000֏", people: "2-4", rating: "5.0" },
    { id: 3, image: "https://amaranoc.am/_next/image?url=https%3A%2F%2Fapi.amaranoc.am%2Fcompressed_images%2Fcompressed_1758095203425--0.034694092059661896image.webp&w=1920&q=75", location: "Ծաղկաձոր", price: "75,000֏", people: "6-10", rating: "4.9" },
  ];

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

  const handleOrderSubmit = () => {
    if (formData.recipientName && formData.phoneNumber) setBookingStep(2);
    else alert("Խնդրում ենք լրացնել բոլոր դաշտերը։");
  };

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

      <div className="py-10">
        <h2 className="text-center text-4xl font-bold mb-10 uppercase">ՀԱՏՈՒԿ ԶԵՂՉԵՐ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-10 gap-8">
          {discounts.map((item, index) => (
            <div key={index} className="relative rounded-xl overflow-hidden shadow-lg h-80 group">
              <img src={item.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-5 text-white">
                <div className="text-5xl font-extrabold mb-3 text-orange-400">{item.percent}</div>
                <div className="font-semibold text-lg mb-1">{item.title}</div>
                <p className="text-sm opacity-90">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold leading-snug text-gray-900 uppercase">
            Պատվիրի՛ր <span className="text-orange-500">Նվեր քարտ</span> <br />
            Քո կամ ընկերերիդ համար
          </h1>
          <div className="border-b-4 border-orange-500 my-5 w-20"></div>
          <p className="text-gray-600 text-lg leading-relaxed">
            Բաց մի թող մեր բացառիկ նվեր քարտերը։ Եթե պլանավորում ես քո հաջորդ արձակուրդը՝
            ընկերներիդ կամ ընտանիքիդ անդամների հետ, մեր զեղչային քարտերը առաջարկում են
            անգերազանցելի խնայողություններ:
          </p>
        </div>
        <div className="rounded-3xl p-10 shadow-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white flex flex-col items-center">
          <img src="https://amaranoc.am/images/white-logo.svg" alt="Logo" className="w-48 mb-10 opacity-90" />
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            {prices.map((price, i) => (
              <button
                key={i}
                onClick={() => setSelectedPrice(price)}
                className={`px-6 py-2 border-2 border-white rounded-full text-lg transition 
                    ${selectedPrice === price ? 'bg-white text-orange-600 font-bold' : 'hover:bg-white/20'}`}
              >
                {price}
              </button>
            ))}
          </div>
          <button onClick={() => selectedPrice ? setIsModalOpen(true) : alert("Ընտրեք արժեքը")} className="px-10 py-3 bg-white text-orange-600 font-bold rounded-full shadow-md text-lg">
            Պատվիրել
          </button>
        </div>
      </div>

      <div className="py-10">
        <h1 className='text-center text-4xl font-bold mb-10 uppercase italic'>Թեժ առաջարկներ</h1>
        <div className="grid grid-cols-1 px-10 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {houses.map((item) => (
            <Link key={item.id} href={`/houses/${item.id}`} className="bg-white rounded-2xl overflow-hidden shadow-lg group">
              <div className="relative h-60">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="" />
                <button className="absolute top-3 right-3 bg-white/70 p-2 rounded-full">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="p-4 flex flex-col gap-4">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span className="flex items-center gap-2"><MapPin size={16} className="text-orange-500" /> {item.location}</span>
                  <span className="flex items-center gap-2"><Users size={16} className="text-orange-500" /> {item.people} հոգի</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg text-black">{item.price}</p>
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                    <Star size={14} fill="currentColor" /> {item.rating}
                  </span>
                </div>
              </div>
            </Link>
          ))}
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
            <span className="text-sm text-gray-300 uppercase">AMARANOC.INFO@GMAIL.COM</span>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <X size={24} />
            </button>
            {bookingStep === 1 ? (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center">Պատվիրել Նվեր Քարտ</h3>
                <p className="text-center text-orange-600 font-bold text-2xl">{selectedPrice}</p>
                <input type="text" placeholder="Անուն Ազգանուն" className="w-full p-3 border rounded-xl outline-none" onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })} />
                <input type="tel" placeholder="Հեռախոսահամար" className="w-full p-3 border rounded-xl outline-none" onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                <button onClick={handleOrderSubmit} className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl">Հաստատել</button>
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-black">Շնորհակալություն</h3>
                <p className="text-gray-500 mb-6">Ձեր հայտը հաստատվել է:</p>
                <button onClick={() => { setIsModalOpen(false); setBookingStep(1); }} className="w-full py-3 bg-black text-white rounded-xl font-bold">Փակել</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}