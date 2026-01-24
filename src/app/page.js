import Image from "next/image"

export default function Home() {
  return (
    <>
      <div className="flex gap-96 my-5">
        <div className="flex items-start justify-start">
          <img src="/logo.svg" alt="Logo" width="150"/>
        </div>
        <div className="flex items-center justify-center">
          <a className="">Գլխավոր</a>
          <a>Զեղչեր</a>
          <a>Ծառայություններ</a>
          <a>Մեր մասին</a>
        </div>
        <div className="flex justify-end items-end"></div>
      </div>
    </>
  );
}
