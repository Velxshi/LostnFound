

export default function ListCategory({ data }: { data: any }) {

    const listItems = data?.categories || [];
    if (listItems.length === 0) {
    return <div className="text-center py-10 text-gray-500">Belum ada kategori yang tersedia.</div>;
    }

    return (
    <div className="flex flex-col gap-4 w-full">
        {listItems.map((item: any) => (
        <div 
            key={item.id} 
            className="flex h-20 w-full justify-between items-center bg-[#FEFEFE] rounded-[20px] px-6 shadow-sm border border-gray-100"
        >
            <div className="flex flex-col">
            <h3 className="text-[#1A1A1A] font-regular text-md font-poppins">
                {item.name}
            </h3>
            <span className="text-[#A1A1A1] text-sm font-poppins mt-1 font-light">
              {item.totalItems} Barang
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Tombol Edit */}
            <button className="hover:bg-blue-50 p-2 rounded-full transition-colors group">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.66667 13.3333H2.85417L11 5.1875L9.8125 4L1.66667 12.1458V13.3333ZM0.833333 15C0.597222 15 0.399445 14.92 0.24 14.76C0.0805556 14.6 0.000555556 14.4022 0 14.1667V12.1458C0 11.9236 0.0416667 11.7117 0.125 11.51C0.208333 11.3083 0.326389 11.1314 0.479167 10.9792L11 0.479167C11.1667 0.326389 11.3508 0.208333 11.5525 0.125C11.7542 0.0416667 11.9658 0 12.1875 0C12.4092 0 12.6244 0.0416667 12.8333 0.125C13.0422 0.208333 13.2228 0.333333 13.375 0.5L14.5208 1.66667C14.6875 1.81944 14.8089 2 14.885 2.20833C14.9611 2.41667 14.9994 2.625 15 2.83333C15 3.05556 14.9617 3.2675 14.885 3.46917C14.8083 3.67083 14.6869 3.85472 14.5208 4.02083L4.02083 14.5208C3.86806 14.6736 3.69083 14.7917 3.48917 14.875C3.2875 14.9583 3.07583 15 2.85417 15H0.833333ZM10.3958 4.60417L9.8125 4L11 5.1875L10.3958 4.60417Z" fill="#2848B7"/>
              </svg>
            </button>

            {/* Tombol Delete */}
            <button className="hover:bg-red-50 p-2 rounded-full transition-colors group">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 4.1665V15.8332C15 16.2498 14.5833 16.6665 14.1667 16.6665H10H5.83333C5.41667 16.6665 5 16.2498 5 15.8332V4.1665" stroke="#C10007" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.33301 4.1665H16.6663" stroke="#C10007" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.33301 3.33325H11.6663M8.33301 7.49992V13.3333M11.6663 7.49992V13.3333" stroke="#C10007" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}