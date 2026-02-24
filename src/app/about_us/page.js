"use client"

import React from 'react';
import { User, Globe, Search, Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { useEffect,useState } from 'react';
import { fetch, fetchData } from "@/lib/api.js"

export default function About() {


  // const sectionData = [
  //   {
  //     id: 0,
  //     title: "Մեր մասին",
  //     text: `Amaranoc.am-ը վստահության, հավատարմության և գերազանցության ձգտման պատմություն է: 
  //     Հանդիսանալով ամառանոցների վարձակալության ոլորտում համար մեկ ընկերությունը, մենք ձեզ 
  //     առաջարկում ենք շքեղ առանձնատների, քոթեջների, վիլլաների և ամառանոցների լայն ու բազմազան 
  //     ընտրություն; Մեր հիմնական առաքելությունն է սպասարկել մեր հաճախորդներին ամենաբարձր մակարդակով՝ 
  //     ստեղծելով հարմարավետության և շքեղության մթնոլորտ մեր յուրաքանչյուր առանձնատանը:Մեր 
  //     նվիրվածությունը և մանրուքների հանդեպ ուշադրությունը երաշխավորում է հիշարժան հանգիստ Հայաստանի ամենահիասքանչ ամառանոցներում`,
  //     image: "/image/about_us.webp"
  //   },
  //   {
  //     id: 1,
  //     title: "Մեր թիմը",
  //     text: `Շուրջ 20 մասնագետներից բաղկացած մեր պրոֆեսիոնալ թիմն իր աշխատանքն իրականացնում է 
  //     փայլուն հմտությամբ՝ բավարարելու անգամ ամենաքմահաճ հաճախորդի կարիքները: Շնորհիվ ոլորտում 
  //     ունեցած մեր անգնահատելի փորձի, մեր նպատակն է անմոռանալի պահեր ստեղծել մեր հյուրերի համար: 
  //     Մենք պարզապես չենք ստեղծում ժամանց, մենք ստեղծում ենք պատմություններ, և յուրաքանչյուր 
  //     առանձնատուն (որոնք դուք տեսնում եք մեր կայքում) այդ պատմության մի մասն է: Օրեցօր ընդլայնվելով՝ 
  //     մենք ձգտում ենք նորագույն չափանիշներ սահմանել ոլորտում և որ ամենակարևորն է մենք օր օրի հստակ ու 
  //     կայուն քայլերով շարժվում ենք առաջ՝ բարելավելով մեր երկրում սպասարկման ոլորտը՝ շքեղ առանձնատները հասանելի դարձնելով բոլորին:`,
  //     image: "/image/team.webp"
  //   },
  //   {
  //     id: 2,
  //     title: "Ինչու համագործակցել amaranoc.am -ի հետ",
  //     text: `Amaranoc.am-ի ընտրությունը երաշխավորում է շքեղության, անհատականացված սպասարկման բարձր 
  //     մակարդակ և իհարկե վստահության հիմքի վրա կառուցված կայուն համագործակցություն. Գերազանցության 
  //     հանդեպ մեր բարձր ձգտումը և հավատարմությունը, էքսկլուզիվ առաջարկների լայն ընտրությունը և մեր 
  //     յուրաքանչյուր հյուրի նախասիրությունների նկատմամբ մանրակրկիտ ուշադրությունը մեզ առանձնացնում 
  //     են ոլորտում բոլորից՝ դարձնելով առաջատար; Մենք առաջարկում ենք որակ և ստեղծում ենք հարմարավետության 
  //     բարձր զգացում, որոնք գերազանցում են ձեր բոլոր սպասելիքները; Մենք բարձր ենք գնահատում մեր 
  //     գործընկերների և մեր հաճախորդների վստահությունը: Այդ վստահությունը մեր ընկերության հիմքն է: 
  //     Մենք խորապես հակված ենք այն գաղափարին, որ մեր առանձնատներում անցկացրած յուրաքանչյուր պահը պետք է 
  //     լինի առանձնահատուկ: Մեր գործընկերների և հաճախորդների վստահությունը մեր կարևորագույն արժեքն է, իսկ ամենաբարձր մակարդակով սպասարկումը մեր ընդհանուր նպատակը:`,
  //     image: "/image/amaranoc.webp"
  //   },
  //   {
  //     id: 3,
  //     title: "Մարքեթինգ",
  //     text: `Amaranoc.am-ում մենք գիտակցում ենք մարքեթինգի առանցքային դերը ամառանոցների վարձակալության 
  //     ոլորտում; Մեր ռազմավարական մարքեթինգային նախաձեռնությունները ներառում են էքսկլյուզիվ համագործակցություններ 
  //     և շեշտադրում են մեր ամառանոցների եզակի առանձնահատկությունները. 10 մասնագետից բաղկացած մեր պրոֆեսիոնալ 
  //     մարքեթինգի թիմը աշխատում է բարձր պատասխանատվությամբ և նվիրումով, որպեսզի դուք միշտ առաջինը տեղեկացված լինեք լավագույն առաջարկների մասին.`,
  //     image: "/image/marketing.webp"
  //   },
  //   {
  //     id: 4,
  //     title: "Մեր պատմությունը",
  //     text: `Amaranoc.am - ը հիմնադրվել է 2023 թվականի հուլիսի 1-ին և հենց այդ օրվանից սկսած մինչ օրս 
  //     մենք չենք դադարում զարմացնել մեր հաճախորդներին և գոհացնել մեր գործընկերներին; Մենք հպարտ ենք, որ 
  //     այս նախագիծը մեր ողջ թիմի համատեղ ջանքերի արդյունքն է և հանդիսանում է Hasce.am անշարժ գույքի ընկերության 
  //     ամենակարևոր մաս: Յուրաքանչյուր քայլ ամրապնդել է մեր հիմնադիր սկզբունքները և առաջ է մղել մեզ ձեռք բերել 
  //     անուն, որին վստահում են բոլորը. Եվ եթե դուք այստեղ եք, հավատացած եղեք, որ ամեն ինչ դեռ առջևում է.`,
  //     image: "/image/history.webp"
  //   },
  // ]

  const [sectionData,setSectionData] = useState([])

  const pathName = usePathname();

  const linkClass = (path) =>
    `relative pb-1 transition-all text-white
     ${pathName === path
      ? "after:w-full"
      : "after:w-0 hover:after:w-full"
    }
     after:content-['']
     after:absolute
     after:left-0
     after:bottom-0
     after:h-[2px]
     after:bg-orange-500
     after:transition-all
     after:duration-300`;

      useEffect(() => {
         fetchData('about').then(data => {
           if (data) {
             setSectionData(data);
           }
         });
       }, []);
     

  return (
    <>
      <div className="relative h-screen w-full">
        <div className="absolute inset-0 z-0">
          <Image
            src="/image/first_image.webp"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <header className="relative z-10 flex justify-between items-center px-10 py-7 max-w-[1600px] mx-auto">

          <div className="flex items-start justify-start">
            <Link href="/">
              <img
                src="/logo.svg"
                alt="Logo"
                width="170"
                className="brightness-0 invert"
              />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-10">
            <Link className={linkClass("/")} href="/">Գլխավոր</Link>
            <Link className={linkClass("/sales")} href="/sales">Զեղչեր</Link>
            <Link className={linkClass("/service")} href="/service">Ծառայություններ</Link>
            <Link className={linkClass("/about_us")} href="/about_us">Մեր մասին</Link>
          </div>

          <div className="flex gap-5 justify-end items-center text-white">
            <button className="hover:text-orange-400 transition">
              <Globe className="w-5 h-5" />
            </button>

            <button className="hover:text-orange-400 transition">
              <User className="w-5 h-5" />
            </button>

            <div className="relative">
              <input
                type="text"
                placeholder="Որոնում"
                className="pl-4 pr-10 py-2 bg-white/10 border border-white/30 rounded-3xl text-white placeholder:text-gray-300 focus:outline-none focus:bg-white/20 backdrop-blur-sm"
              />
              <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </header>
      </div>

      <section className="bg-gray-50 pt-16 font-sans">
        <div className="w-full space-y-20"> 

          {sectionData.map((section, index) => (
            <React.Fragment key={section.id}>

              <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20">
                <div
                  className={`flex flex-col md:flex-row items-center gap-10 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""
                    }`}
                >
                  <div className="w-full md:w-1/2">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-[400px] object-cover rounded-3xl shadow-lg"
                    />
                  </div>

                  <div className="w-full md:w-1/2 flex flex-col">
                    <div className="flex items-center mb-4">
                      <span className="h-[2px] w-8 bg-black mr-4"></span>
                      <h2 className="text-2xl font-bold tracking-wider">{section.title}</h2>
                      <div className="ml-4 flex-grow h-[1px] bg-gray-300"></div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg text-justify">
                      {section.text}
                    </p>
                  </div>
                </div>
              </div>

              {(index === 1 || index === 4) && (
                <div className="w-full py-10">
                  <img
                    src={index === 1 ? "/image/second.webp" : "/image/third.webp"}
                    alt="Full Width Banner"
                    className="w-full h-[500px] md:h-[600px] object-cover shadow-2xl"
                  />
                </div>
              )}

            </React.Fragment>
          ))}

        </div>
      </section>

      <div className="bg-black text-white flex justify-center w-auto ">
        <div className=" border-1 border-white/20 rounded-2xl mx-auto my-16 max-w-6xl w-full flex flex-wrap justify-center">
          <div className="flex justify-center items-center gap-8 px-10 pt-20 w-full">
            <div className="flex-1 h-0.5 bg-white"></div>
            <div><h1 className="text-3xl text-center">ՏԵՂԱԴՐԵԼ ՀԱՅՏԱՐԱՐՈՒԹՅՈՒՆ</h1></div>
            <div className="flex-1 h-0.5 bg-white"></div>
          </div>
          <div className="flex justify-center pt-6 w-full px-4">
            <p className="text-center">Մուտքագրեք Ձեր տվյալները նշված դաշտերում և մենք կկապնվենք Ձեզ հետ</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-6 pb-20 px-10 w-full">
            <input
              type="text"
              placeholder="Անուն Ազգանուն"
              className="border-1 border-white/40 bg-transparent rounded-2xl px-6 py-2 flex-1 min-w-[200px]"
            />
            <input
              type="tel"
              placeholder="Հեռախոսահամար"
              className="border-1 border-white/40 bg-transparent rounded-2xl px-6 py-2 flex-1 min-w-[200px]"
            />
            <input
              type="email"
              placeholder="Էլ․ Հասցե"
              className="border-1 border-white/40 bg-transparent rounded-2xl px-6 py-2 flex-1 min-w-[200px]"
            />
            <button
              className="rounded-3xl px-8 py-2 bg-orange-400 hover:bg-orange-500 transition font-medium text-black"
            >Ուղարկել</button>
          </div>
        </div>
      </div>

      <div className=" bg-[#101623ff] text-white">
        <div className="flex justify-center items-center">
          <h1 className="text-3xl my-6">ԿՈՆՏԱԿՏՆԵՐ</h1>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 p-4 bg-gray-900/50 text-white border-y border-white/10">
          <div className="flex items-center gap-2">
            <Phone size={20} className="text-orange-400" />
            <span className="text-sm">041-611-611 / 044-611-611</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={20} className="text-orange-400" />
            <span className="text-sm text-gray-300 uppercase">amaranoc.info@gmail.com</span>
          </div>
          <a href="#" className="flex items-center gap-2 hover:text-orange-400 transition">
            <Instagram size={20} />
            <span className="text-sm font-medium">AMARANOC.AM</span>
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-orange-400 transition">
            <Facebook size={20} />
            <span className="text-sm font-medium">AMARANOC.AM</span>
          </a>
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-orange-400" />
            <span className="text-sm ">ԹՈՒՄԱՆՅԱՆ 5</span>
          </div>
        </div>
        <div className="flex flex-col items-center py-6">
          <p className="underline cursor-pointer hover:text-orange-400 transition mb-2">Գաղտնիության քաղաքականություն</p>
          <p className="text-gray-400 text-sm">Ամառանոց ՍՊԸ | Amaranoc LLC | Амараноц OOO</p>
        </div>
        <div className="relative w-full h-32">
          <Image
            src="/image/footer-background.webp"
            alt="footer image"
            fill
            className="object-cover opacity-50"
          />
        </div>
      </div>
    </>
  );
}