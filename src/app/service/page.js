"use client"

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import {
  User, Globe, Search, Facebook, Instagram, Phone, Mail, MapPin,
  CarFront, HandPlatter, WandSparkles, PartyPopper, Rocket,
  UtensilsCrossed, Video, ChevronLeft, ChevronRight, Tag
} from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";

export default function Service() {
  const pathName = usePathname();
  const [activeTab, setActiveTab] = useState("Սպասարկում");

  const categories = [
    { name: "Սպասարկում", icon: <HandPlatter size={28} /> },
    { name: "Շոու", icon: <WandSparkles size={28} /> },
    { name: "Միջոցառումներ", icon: <PartyPopper size={28} /> },
    { name: "Տեխնիկա", icon: <Rocket size={28} /> },
    { name: "Օրավարձով գույք", icon: <UtensilsCrossed size={28} /> },
    { name: "Նկարահանում", icon: <Video size={28} /> },
    { name: "Ուղևորափոխադրում", icon: <CarFront size={28} /> },
  ];

  const servicesData = {
    "Սպասարկում": [
      {
        id: 1,
        title: "Մատուցող",
        description: "Յուրաքանյչուր մատուցող կարող է սպասարկել 15-20 անձի։ Ծառայության արժեքը կախված է միջոցառման անցկացման վայրից։",
        image: "/image/service/1724331775249--0.webp",
        price: 20000,
      },
      {
        id: 2,
        title: "Բարմեն",
        description: "Մեր պրոֆեսիոնալ բարմենները տիրապետում են տարբեր տեսակի խմիչքների պատրաստման հմտություններին։",
        image: "/image/service/1724330468263--0.webp",
        price: 25000,
      },
      {
        id: 3,
        title: "Խոհարար",
        description: "Արժեքը կախված է միջոցառման անձանց քանակից և ուտեստների մենյուից։",
        image: "/image/service/1724331582281--0.webp",
        price: 35000,
      },
      {
        id: 4,
        title: "Հանդիսավար",
        description: "Իսկական հանդիսավարը կարող է իր վարպետությամբ ստեղծել հիասքանչ և տոնական մթնոլորտ։",
        image: "/image/service/1724346434036--0.webp",
        price: 60000,
      },
      {
        id: 5,
        title: "Փրփուր Փարթի",
        description: "Նյութերը սերտիֆիկացված են, աչքերը չեն մռմռացնում, անվնաս են բույսերի և լողավազանի համար:",
        image: "/image/service/1725721755318--0.webp",
        price: 26900,
      }
    ],
    "Շոու": [
      {
        id: 6,
        title: "Դի-Ջեյ",
        description: "Ստեղծում են յուրաքանյչուր ճաշակին համապատասխան երաժշտական մթնոլորտ:",
        image: "/image/service/DJ.webp",
        price: 50000,
      }, {
        id: 7,
        title: "Երգիչ",
        description: `Amaranoc.am ի երգիչները, իրենց զարմանալի ձայնով և տաղանդով, կստեղծեն 
        յուրահատուկ մթնոլորտ։ Ընկղմվեք հնչյունների և ռիթմերի աշխարհում՝ վայելելով երաժշտության աննկարագրելի հաճույքը։`,
        image: "/image/service/Artist.webp",
        price: 150000,
      }, {
        id: 8,
        title: "Կրակներով շոու",
        description: `Կրակներով շոուն կստեղծի վառ և հիասքանչ ժամանց, որոնք կտպավորվեն մշտեպես Ձեր հիշողության մեջ։ 
        Մեր պրոֆեսիոնալ արտիստները տիրապետելով կրակի հետ խաղալու արվեստին, ստեղծում են ապշեցուցիչ գեղեցկությամբ և 
        ադրենալինով լի ներկայացումներ: Այստեղ դուք կընկղմվեք մի աշխարհ,որտեղ դուք ամբողջովին կզգաք կրակի իրական գեղեցկությունը և ջերմությունը։`,
        image: "/image/service/Show_with_fire.webp",
        price: 50000,
      }, {
        id: 9,
        title: "Ջութակահար",
        description: `Մեր տաղանդավոր երաժիշտները կստեղծեն անկրկնելի մթնոլորտ, որը կլցնի Ձեր միջոցառումը երաժշտության 
        հրաշքներով՝ դասական հնչյուններից մինչև ժամանակակից հիթեր։ Մեղեդիների ուղեկցությամբ Դուք կտեղափոխվեք մի աշխարհ՝ լցված նրբագեղությամբ և ոգեշնչմամբ։`,
        image: "/image/service/Violinist.webp",
        price: 80000,
      }, {
        id: 10,
        title: "Խաղավար",
        description: "Մեր խաղավարները միշտ կգտնեն Ձեր հյուրերին ուրախացնելու և Ձեր միջոցառումը մրցույթներով զարդարելու միջոց:",
        image: "/image/service/Gameplay.webp",
        price: 15000,
      }, {
        id: 11,
        title: "Մուլտհերոսներ",
        description: `Մեր մուլտհերոսները կախարդական կերպարներ են, ովքեր ժպիտ ու ուրախություն կպարգևեն ոչ միայն երեխաներին, 
        այլև մեծերին: Իրենց գունեղ անհատականություններով նրանք ձեզ կտանեն ֆանտաստիկայի և արկածների հիանալի աշխարհ՝ բարի և 
        խիզախ սուպերհերոսներից մինչև սրամիտ և զվարճալի կենդանիներ։ Ձեր միջոցառմանը հրավիրեք Մեր սիրելի մուլտհերոսներին, և 
        նրանք կպարգևեն Ձեր հյուրերին ուրախության և կախարդական նմոռանալի պահեր:`,
        image: "/image/service/MultHeroes.webp",
        price: 5000,
      }, {
        id: 12,
        title: "Աճպարհար",
        description: `Աճպարարի յուրաքանչյուր ներկայացում՝ լինի դա խենթ շողալու մոգություն, բարդ թարմություն կամ ճկուն տեխնիկա, 
        միշտ առանձնանում է բացառիկությամբ: Նա ստեղծում է մթնոլորտ, որտեղ իրականությունը ու երևակայությունը միաձուլվում են, իսկ 
        հանդիսատեսը հայտնվում է մի աշխարհում, որտեղ ամեն ինչ հնարավոր է: Հրավիրելով Մեր աճպարարին Դուք հնարավորություն կունենաք 
        ականատես լինելու անհավատալի տեսարանների, որոնք կզարմացնեն ոչ միայն փոքրերին այլ նաև մեծերին։`,
        image: "/image/service/MagicMan.webp",
        price: 60000,
      },
    ],
    "Միջոցառումներ": [{
      id: 13,
      title: "Նշանադրության կազմակերպում",
      description: `Նշանադրության արարողությունը առանձնահատուկ պահ է զույգի կյանքում: Մեր ընկերությունը կազմակերպում է նշանադրության 
      արարողություն, որը ստեղծում է կախարդական պահեր սիրահարների համար: Մեր նպատակն է անմոռանալի դարձնել այդ հիասքանչ միջոցառումը։ 
      Մենք ցուցաբերում ենք անհատական մոտեցում յուրաքանչյուր զույգին՝ օգնելով նրանց ստեղծել կատարյալ իրադարձություն։ Մեր փորձառու և 
      ստեղծագործ թիմը կապահովի արարողության գեղեցիկ դիզայնը ,սպասարկումը, երաժշտությունը,լուսային էֆֆեկտները և բոլոր մանրուքները, 
      ինչը կօգնի լիարժեք վայելելու Ձեր օրը։`,
      image: "/image/event/Event_1.webp",
      price: 500000,
    }, {
      id: 14,
      title: "Ծննդյան առիթների կազմակերպում",
      description: `«Amaranoc.am»-ը ձեր վստահելի գործընկերն է ծննդյան տոների կազմակերպման գործում: Մենք մասնագիտացած ենք ստեղծելու 
      անմոռանալի միջոցառումներ, որոնք ընդգծում են հոբելյարի յուրահատկությունն ու անհատականությունը: Մեր կրեատիվ մասնագետների թիմը 
      հոգ կտանի ամեն ինչի մասին՝ սկսած կոնցեպտից և դեկորից, մինչև զվարճանք և խոհարարական հյուրասիրություն: Վստահե՛ք մեզ ձեր ծննդյան 
      օրը կազմակերպելու գործը, և այն իսկապես անմոռանալի կլինի:`,
      image: "/image/event/Event_2.webp",
      price: 150000,
    }, {
      id: 15,
      title: "Հարսանյաց սենյակի ձևավորում",
      description: `Հարսանյաց սենյակի ձևավորման գործում Ձեզ կօգնի Մեր դիզայներների և ոճաբանների թիմը՝ ովքեր հաշվի առնելով Ձեր նախասիրությունները 
      և անհատականությունը, կհաղորդեն սենյակին նրբաճաշակություն, շքեղություն: Նուրբ գործվածքներից և մոմերից մինչև նրբաճաշակ ծաղիկներ և զարդեր։ 
      ️️Վստահեք Ձեր կյանքի ամենակարևոր առիթներից մեկը Մեր թիմին, ունենալով շքեղ և չկրկնվող ձևավորումներ։`,
      image: "/image/event/Event_3.webp",
      price: 80000,
    }, {
      id: 16,
      title: "Ֆոտոզոնաների ձևավորում",
      description: `«Amaranoc.am» Ձեր ուղեցույցն է եզակի և հիշվող ֆոտոզոնաների ստեղծման ոլորտում: Մենք մասնագիտացած ենք լուսանկարչական գոտիների ստեղծման 
      գործում, որոնք կատարյալ լրացում են Ձեր միջոցառման համար: Կախված Ձեր միջոցառման թեմայից, Մենք կստեղծենք լուսանկարչական գոտի, որը կարտացոլի ձեր ոճը և 
      կտա հնարավություն ունենալու գեղեցիկ և յուրահատկուկ նկարներ:`,
      image: "/image/event/Event_4.webp",
      price: 40000,
    }, {
      id: 17,
      title: "Գենդեր փարթի",
      description: `Գիտակցելով միջոցառման կարևորությունը Մեր կրեատիվ թիմը պատրաստ է ամբողջության կազմակերպելու այս գեղեցիկ օրը, դարձնելով այն անմոռանալի։ 
      Մենք կօգնենք Ձեզ պլանավորելու, զարդարելու, խաղերի և ժամանցի հարցում, որպեսզի Ձեր միջոցառումը լինի գեղեցիկ և ուրախ իրադարձություն, որը կհիշվի ամբողջ կյանքում:`,
      image: "/image/event/Event_5.webp",
      price: 180000,
    }],
    "Տեխնիկա": [{
      id: 18,
      title: "Ծանր ծուխ",
      description: `Լավագույն ծանր ծուխը, որը ձեր միջոցառումն կդարձնի էլ ավելի գողեցիկ և հիշարժան։ Մեր սարքավորումները կարողանում են բարձրորակ ծուխը տարածել 
      մաքսիմալ մեծ մակերեսով և բարձր խտությամբ։ Ծուխն էկոլոգիապես մաքուր է և իր մեջ ներառում է միայն տաք ջուր։`,
      image: "/image/tech/Tech_1.webp",
      price: 30000,
    }, {
      id: 19,
      title: "Հրավառության ծառայություն",
      description: `Հրավառության ծառայությունը առաջարկում է փայլուն և անպայման հիշարժան հրավառություն՝ յուրաքանչյուր իրադարձության համար հատուկ ձևով։ 
      Մեր թիմը կազմակերպում է բոլոր անհրաժեշտ գործընթացները՝ նախապատրաստական աշխատանքից մինչև իրականացման փուլը։ Արժեքները փոփոխվում են կախված միջոցառման 
      ծավալից, հրավառության տեսակից և այլ հանգամանքներից։`,
      image: "/image/tech/Tech_2.webp",
      price: 30000,
    }, {
      id: 20,
      title: "Սառը հրավառություն",
      description: `Սառը հրավառության ծառայությունը առաջարկում է հիանալի, անվտանգ և արտասովոր միջոցառման լուծում՝ կրակ և ծուխ բացակայությամբ: Այս 
      ծառայությունը օգտագործում է հատուկ պիրոտեխնիկական սարքավորումներ, որոնք ստեղծում են գեղեցիկ տեսողական էֆեկտներ՝ օգտագործելով սառը լույսեր, էֆեկտային 
      աղմուկներ և խորը լույսեր, որոնք ի վիճակի են փոխարինել ավանդական հրավառություններին առանց կրակի վտանգի: Արժեքները փոփոխվում են կախված միջոցառման 
      ծավալից, հրավառության տեսակից և այլ հանգամանքներից։`,
      image: "/image/tech/Tech_3.webp",
      price: 30000,
    }, {
      id: 21,
      title: "Պրոյեկտոր",
      description: `Ձեր միջոցառումները դարձնելու համար ավելի հարմարավետ ու արդյունավետ, մենք տրամադրում ենք պրոյեկտորներ տարբեր որակի և չափսերի։ 
      Իրականացնում ենք նաև տեղադրում։ Արժեքը կախված պրոյեկտորի տեսակից կարող է փոփոխվել։`,
      image: "/image/tech/Tech_4.webp",
      price: 15000,
    }, {
      id: 22,
      title: "Նվագարկիչ",
      description: `Ձեր միջոցառման երաժշտական առավելության հասնելու համար առաջարկում ենք բարձր որակի նվագարկիչների օրավարձով վարձակալության ծառայություն: 
      Արժեքը կարող է փոփոխվել կախված նվագարկիչների չափսերից և որակից։`,
      image: "/image/tech/Tech_5.webp",
      price: 10000,
    }],
    "Օրավարձով գույք": [{
      id: 23,
      title: "Սպասք",
      description: `Ձեր միջոցառումները դարձնելու համար ավելի հարմարավետ և ոճային, առաջարկում ենք օրավարձով սպասքի ծառայություններ։ Տրամադրվում է տարբեր ձևի 
      և միանման ամաններ, գդալներ, պատառաքաղներ և այն ամենը ինչ անհրաժեշտ է ուտեստների գեղեցիկ մատուցման համար։`,
      image: "/image/daily_rentals/Daily_rentals_1.webp",
      price: 100,
    }, {
      id: 24,
      title: "Սեղան և աթոռներ",
      description: `Մեր օրավարձով կահույքի ծառայությունը հնարավորություն է տալիս վարձակալել բարձր որակի սեղաններ և աթոռներ՝ համաձայն ձեր կարիքների:`,
      image: "/image/daily_rentals/Daily_rentals_2.webp",
      price: 5000,
    }, {
      id: 25,
      title: "Տենտ",
      description: `Մեր տենտերը համադրվում են ցանկացած միջոցառմանը և հիանալի լուծում են պաշտպանվելու համար ցանկացած եղանակից։ Այն կդարձնի ձեր միջոցառման 
      անցկացման վայրը ավելի գեղեցիկ և ոճային։ Արժեքները կարող են փոփոխվել կախված չափսերից և քանակից։`,
      image: "/image/daily_rentals/Daily_rentals_3.webp",
      price: 20000,
    }],
    "Նկարահանում": [{
      id: 26,
      title: "Ֆոտո նկարահանում",
      description: `Մենք ուրախ ենք առաջարկել պրոֆեսիոնալ ֆոտո նկարահանման ծառայություն։ Մեր նպատակն է, որ ձեր միջոցառումը կամ պրոեկտը անցնի համարձակ և 
      ստեղծագործական միջավայրում՝ առանց որևէ տեխնիկական անհանգստությունների: Արժեքները կարող են փոփոխվել կախված քանակից և միջոցառման անցկացման վայրից։`,
      image: "/image/filming/Filming_1.webp",
      price: 20000,
    }, {
      id: 27,
      title: "Վիդեո նկարահանում",
      description: `Ձեր տեսանյութերը կստանան բարձր որակ և պրոֆեսիոնալ շունչ մեր վիդեո նկարահանման ծառայության միջոցով: Բարձրացրեք ձեր տեսանյութերի որակը՝ 
      առանց մեծ ներդրումների: Արժեքը կարող է փոփոխվել կախված միջոցառման չափսից և անցկացման վայրից։`,
      image: "/image/filming/Filming_2.webp",
      price: 35000,
    }, {
      id: 28,
      title: "Դրոնով նկարահանում",
      description: `Ապահովեք ձեր նախագծերին անկրկնելի տեսողական որակ մեր պրոֆեսիոնալ դրոններով: Մենք առաջարկում ենք նորագույն տեխնոլոգիաներով զինված դրոններով 
      նկարահանում, որն ապահովում է աննախադեպ բարձր որակի օդային նկարահանումներ տարբեր առիթների համար:`,
      image: "/image/filming/Filming_3.webp",
      price: 25000,
    }],
    "Ուղեևորափոխադրում": [{
      id: 29,
      title: "Ուղևորափոխադրում",
      description: `Մենք տրամադրում ենք բարձրակարգ փոխադրամիջոցներ՝ ապահովելով Ձեր ճանապարհորդության հարմարավետությունն ու անվտանգությունը: Մեքենաները գտնվում 
      են մաքուր և սարքին վիճակում։ Արժեքները կարող են փոփոխվել կախված ուղևորության տեսակից։`,
      image: "/image/passenger_transportation/Passenger_transportation.webp",
      price: 20000,
    }],
  };

  const activeServices = servicesData[activeTab] || [];

  const linkClass = (path) =>
    `relative pb-1 transition-all
     ${pathName === path ? "after:w-full" : "after:w-0 hover:after:w-full"}
     after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px]
     after:bg-orange-500 after:transition-all after:duration-300`;

  return (
    <div className="min-h-screen bg-white">
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

      <section className="max-w-[1500px] mx-auto px-12 my-12">
        <div className="relative flex items-center group">
          <button className="custom-prev-arrow absolute -left-12 z-10 flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full bg-white hover:border-orange-500 transition-all shadow-sm">
            <ChevronLeft size={22} className="text-gray-600" />
          </button>

          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={6}
            navigation={{
              nextEl: '.custom-next-arrow',
              prevEl: '.custom-prev-arrow'
            }}
            className="w-full border-b border-gray-100 pb-4"
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.name}>
                <div
                  onClick={() => setActiveTab(cat.name)}
                  className='flex flex-col items-center cursor-pointer group/item'
                >
                  <span className={`mb-3 transition-colors ${activeTab === cat.name ? 'text-orange-500' : 'text-gray-400 group-hover/item:text-black'}`}>
                    {cat.icon}
                  </span>
                  <p className={`text-[14px] font-medium transition-colors ${activeTab === cat.name ? 'text-black' : 'text-gray-500'}`}>
                    {cat.name}
                  </p>
                  <div className={`h-[3px] bg-orange-500 transition-all duration-300 mt-2 rounded-full 
                    ${activeTab === cat.name ? 'w-10 opacity-100' : 'w-0 opacity-0'}`}>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="custom-next-arrow absolute -right-12 z-10 flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full bg-white hover:border-orange-500 transition-all shadow-sm">
            <ChevronRight size={22} className="text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-16">
          {activeServices.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[1.8rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col border border-gray-100"
            >
              <div className="relative w-full aspect-[16/9.5] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="p-5 pt-4 flex flex-col flex-grow">
                <h3 className="text-[17px] font-bold text-[#111827] mb-2">
                  {item.title}
                </h3>

                <p className="text-[#374151] text-[13.5px] leading-[1.6] line-clamp-3 mb-6 flex-grow">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5">
                    <Tag size={16} className="text-orange-400 rotate-90 stroke-[2.5px]" />
                    <div className="flex items-center gap-1">
                      <span className="text-[20px] font-extrabold text-[#4B5563]">
                        {item.price.toLocaleString()}
                      </span>
                      <span className="text-[18px] font-bold text-[#4B5563]">֏</span>
                    </div>
                  </div>

                  <button className="px-7 py-1.5 rounded-full border border-orange-400 text-orange-500 font-semibold text-[14px] hover:bg-orange-500 hover:text-white transition-all duration-300">
                    Ամրագրել
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black text-white py-20">
        <div className="max-w-6xl mx-auto border border-gray-800 rounded-3xl p-10 md:p-16">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-6 mb-8 w-full justify-center">
              <div className="hidden md:block h-px bg-gray-700 flex-grow"></div>
              <h2 className="text-2xl md:text-3xl font-light tracking-wide">ՏԵՂԱԴՐԵԼ ՀԱՅՏԱՐԱՐՈՒԹՅՈՒՆ</h2>
              <div className="hidden md:block h-px bg-gray-700 flex-grow"></div>
            </div>
            <p className="text-gray-400 mb-10">Մուտքագրեք Ձեր տվյալները նշված դաշտերում և մենք կկապնվենք Ձեզ հետ</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
              <input type="text" placeholder="Անուն Ազգանուն" className="bg-transparent border border-gray-700 rounded-full px-6 py-3 outline-none focus:border-orange-500 transition-all" />
              <input type="tel" placeholder="Հեռախոսահամար" className="bg-transparent border border-gray-700 rounded-full px-6 py-3 outline-none focus:border-orange-500 transition-all" />
              <input type="email" placeholder="Էլ․ Հասցե" className="bg-transparent border border-gray-700 rounded-full px-6 py-3 outline-none focus:border-orange-500 transition-all" />
              <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full py-3 font-semibold transition-all">Ուղարկել</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#0B0F19] text-white">
        <div className="py-10 text-center">
          <h2 className="text-2xl tracking-[0.3em] font-light">ԿՈՆՏԱԿՏՆԵՐ</h2>
        </div>
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-10 pb-10 border-b border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
            <Phone size={18} className="text-orange-500" /> 041-611-611 / 044-611-611
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
            <Mail size={18} className="text-orange-500" /> AMARANOC.INFO@GMAIL.COM
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
            <Instagram size={18} className="text-orange-500" /> AMARANOC.AM
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
            <Facebook size={18} className="text-orange-500" /> AMARANOC.AM
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
            <MapPin size={18} className="text-orange-500" /> ԹՈՒՄԱՆՅԱՆ 5
          </div>
        </div>

        <div className="flex flex-col items-center py-8 gap-3 text-xs text-gray-500">
          <p className="underline uppercase tracking-widest cursor-pointer hover:text-orange-500 transition-all">Գաղտնիության քաղաքականություն</p>
          <p>Ամառանոց ՍՊԸ | Amaranoc LLC | Амараноц OOO</p>
        </div>
        <div className="w-full relative h-24">
          <Image
            src="/image/footer-background.webp"
            alt="footer image"
            fill
            className="object-cover opacity-50"
          />
        </div>
      </footer>
    </div>
  );
}