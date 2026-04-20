import Image from "next/image";

export default function About() {
  const devs = [
    {
      nama: "Bintang Kurniawan",
      role: "Lead Developer",
      img: "https://i.pinimg.com/1200x/e3/6b/c6/e36bc6a279e7cc29547dd0bb84d65939.jpg",
    },
    {
      nama: "Ikhsan Nurul Haq",
      role: "Backend Developer",
      img: "https://i.etsystatic.com/41741243/r/isla/c99b5d/60995380/isla_500x500.60995380_7htk44zi.jpg",
    },
    {
      nama: "M. Nawwaf Yazid Ikromi",
      role: "Project Manager",
      img: "https://i.etsystatic.com/41741243/r/isla/c99b5d/60995380/isla_500x500.60995380_7htk44zi.jpg",
    },
    {
      nama: "Zahran Faiz Salman",
      role: "Backend Developer",
      img: "https://i.etsystatic.com/41741243/r/isla/c99b5d/60995380/isla_500x500.60995380_7htk44zi.jpg",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-8 items-center">
      <div className="w-full flex flex-col gap-6">
        <div className="flex px-3 border-l-8 border-(--royale)">
          <h1 className="font-poppins font-bold text-h5 text-dark">Mengenai Proyek</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="bg-cream-light rounded-3xl flex p-8">
            <div className="flex flex-col gap-3">
              <Image src="/logo/Logo.svg" width={57} height={52} alt="logo" />
              <h3 className="font-poppins font-bold text-title1 text-dark">Lost n Found</h3>
              <p className="font-jakarta text-body text-dark-active">Proyek ini dibangun bukan hanya sekadar untuk memenuhi tugas UAS Mata Kuliah Pemrograman Web, tetapi juga kami ingin berdampak bagi masyarakat.</p>
            </div>
          </div>
          <div className="bg-dark rounded-3xl items-center flex flex-col p-8 justify-center">
            <div className="flex flex-col gap-3 items-center">
              <h3 className="font-poppins font-bold text-h2 text-cream-light">24/7</h3>
              <p className="font-jakarta font-medium text-title2 text-cream-dark">Akses Pelaporan Real-time</p>
            </div>
            <div className="w-full h-9 border-b-4 border-(--royale)"></div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-6">
        <div className="flex px-3 justify-between border-l-8 border-(--royale) items-center">
          <h1 className="font-poppins font-bold text-h5 text-dark">Tim Pengembang</h1>

          <p className="font-jakarta font-medium text-body text-cream-darker text-right">4 Kontributor Aktif</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {devs.map((dev, index) => (
            <div className="flex flex-col p-6 gap-3 rounded-3xl bg-cream-light" key={index}>
              <Image src={dev.img} alt="Developer" width={200} height={200} className="w-full h-auto object-cover aspect-square" />

              <div className="flex flex-col gap-1">
                <h4 className="font-poppins font-bold text-title2 text-dark">{dev.nama}</h4>
                <p className="font-jakarta font-medium text-body  text-dark-hover">{dev.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
