import Image from "next/image";
const CardItem = () => {  

    const data = [
        { 
            id: 1,
            namaBarang: "MacBook Air M2",
            foto: "https://borneostore.co.id/wp-content/uploads/2023/02/e4e524496d013a77046086b0b1756267.jpg",
            waktu: "2 Jam yang lalu",
            status: "Lost",
        },{ 
            id: 2,
            namaBarang: "Ferrari F8 Tributo",
            foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Ferrari_F8_Tributo_Genf_2019_1Y7A5665.jpg/1280px-Ferrari_F8_Tributo_Genf_2019_1Y7A5665.jpg",
            waktu: "4 Jam yang lalu",
            status: "Found",
        },{ 
            id: 3,
            namaBarang: "Iphone 18 Pro Max",
            foto: "https://cdn.antaranews.com/cache/1200x800/2026/02/21/Iphone.jpg",
            waktu: "4 Hari yang lalu",
            status: "Lost",
        },{ 
            id: 4,
            namaBarang: "MacBook Air M2",
            foto: "https://borneostore.co.id/wp-content/uploads/2023/02/e4e524496d013a77046086b0b1756267.jpg",
            waktu: "2 Jam yang lalu",
            status: "Found",
        },{ 
            id: 5,
            namaBarang: "MacBook Air M2",
            foto: "https://borneostore.co.id/wp-content/uploads/2023/02/e4e524496d013a77046086b0b1756267.jpg",
            waktu: "2 Jam yang lalu",
            status: "Found",
        }
        ,{ 
            id: 6,
            namaBarang: "MacBook Air M2",
            foto: "https://borneostore.co.id/wp-content/uploads/2023/02/e4e524496d013a77046086b0b1756267.jpg",
            waktu: "2 Jam yang lalu",
            status: "Found",
        },{ 
            id: 7,
            namaBarang: "MacBook Air M2",
            foto: "https://borneostore.co.id/wp-content/uploads/2023/02/e4e524496d013a77046086b0b1756267.jpg",
            waktu: "2 Jam yang lalu",
            status: "Found",
        }
    ];
return (
    <div className="grid grid-cols-2 gap-3 mt-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {data.map((item) => (
                <div 
                    key={item.id} 
                    className="w-full overflow-hidden rounded-xl bg-white shadow-lg h-41.5 lg:h-46"
                >
                    <div className="relative h-23.5 lg:h-27 w-full ">
                        <div className="relative h-full w-full overflow-hidden rounded-[18px] rounded-b-none">
                            <div className={`flex justify-center items-center absolute w-16.25 h-8 left-2 top-2 z-10 rounded-lg px-3 py-1.5 shadow-sm ${
                                item.status === 'Lost' ? 'bg-[#FF4D4D]' : 'bg-[#FFCE00] '
                            }`}>
                                <span className="text-[13px] font-bold">{item.status}</span>
                            </div>
                            
                            <img
                                src={item.foto} 
                                alt={item.namaBarang}
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="px-4 pb-5 pt-2">
                        <h3 className="truncate font-poppins text-[14px] font-bold text-dark">
                            {item.namaBarang}
                        </h3>
                        
                        <div className="mt-1 flex items-center gap-1 text-[#2848B7]">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.65 0C7.21819 0 9.3 2.08181 9.3 4.65C9.3 7.21819 7.21819 9.3 4.65 9.3C2.08181 9.3 0 7.21819 0 4.65C0 2.08181 2.08181 0 4.65 0ZM4.65 0.93C3.66339 0.93 2.7172 1.32193 2.01956 2.01956C1.32193 2.7172 0.93 3.66339 0.93 4.65C0.93 5.63661 1.32193 6.5828 2.01956 7.28044C2.7172 7.97807 3.66339 8.37 4.65 8.37C5.63661 8.37 6.5828 7.97807 7.28044 7.28044C7.97807 6.5828 8.37 5.63661 8.37 4.65C8.37 3.66339 7.97807 2.7172 7.28044 2.01956C6.5828 1.32193 5.63661 0.93 4.65 0.93ZM4.65 1.86C4.76389 1.86002 4.87382 1.90183 4.95893 1.97751C5.04404 2.0532 5.09842 2.15748 5.11174 2.2706L5.115 2.325V4.45749L6.37375 5.71625C6.45715 5.79993 6.50557 5.91221 6.50918 6.0303C6.51278 6.14839 6.47131 6.26342 6.39317 6.35203C6.31503 6.44064 6.2061 6.49619 6.08849 6.5074C5.97088 6.5186 5.85342 6.48462 5.75995 6.41235L5.71625 6.37375L4.32125 4.97875C4.24897 4.90642 4.20256 4.81229 4.18919 4.71091L4.185 4.65V2.325C4.185 2.20167 4.23399 2.0834 4.3212 1.9962C4.4084 1.90899 4.52667 1.86 4.65 1.86Z" fill="#2848B7"/>
                            </svg>
                            <span className="text-caption font-poppins font-bold">{item.waktu}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
)

}
export default CardItem;