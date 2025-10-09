import React from "react";

const UserAvatar = ({ user, onClick }) => {
  const getColorByInitial = (initial) => {
    const colorMap = {
      'A': { bg: 'bg-red-500', border: 'border-red-700', hover: 'hover:bg-red-600' },
      'B': { bg: 'bg-blue-500', border: 'border-blue-700', hover: 'hover:bg-blue-600' },
      'C': { bg: 'bg-green-500', border: 'border-green-700', hover: 'hover:bg-green-600' },
      'D': { bg: 'bg-yellow-500', border: 'border-yellow-700', hover: 'hover:bg-yellow-600' },
      'E': { bg: 'bg-purple-500', border: 'border-purple-700', hover: 'hover:bg-purple-600' },
      'F': { bg: 'bg-pink-500', border: 'border-pink-700', hover: 'hover:bg-pink-600' },
      'G': { bg: 'bg-indigo-500', border: 'border-indigo-700', hover: 'hover:bg-indigo-600' },
      'H': { bg: 'bg-teal-500', border: 'border-teal-700', hover: 'hover:bg-teal-600' },
      'I': { bg: 'bg-orange-500', border: 'border-orange-700', hover: 'hover:bg-orange-600' },
      'J': { bg: 'bg-cyan-500', border: 'border-cyan-700', hover: 'hover:bg-cyan-600' },
      'K': { bg: 'bg-lime-500', border: 'border-lime-700', hover: 'hover:bg-lime-600' },
      'L': { bg: 'bg-amber-500', border: 'border-amber-700', hover: 'hover:bg-amber-600' },
      'M': { bg: 'bg-emerald-500', border: 'border-emerald-700', hover: 'hover:bg-emerald-600' },
      'N': { bg: 'bg-violet-500', border: 'border-violet-700', hover: 'hover:bg-violet-600' },
      'O': { bg: 'bg-fuchsia-500', border: 'border-fuchsia-700', hover: 'hover:bg-fuchsia-600' },
      'P': { bg: 'bg-rose-500', border: 'border-rose-700', hover: 'hover:bg-rose-600' },
      'Q': { bg: 'bg-sky-500', border: 'border-sky-700', hover: 'hover:bg-sky-600' },
      'R': { bg: 'bg-stone-500', border: 'border-stone-700', hover: 'hover:bg-stone-600' },
      'S': { bg: 'bg-neutral-500', border: 'border-neutral-700', hover: 'hover:bg-neutral-600' },
      'T': { bg: 'bg-zinc-500', border: 'border-zinc-700', hover: 'hover:bg-zinc-600' },
      'U': { bg: 'bg-gray-500', border: 'border-gray-700', hover: 'hover:bg-gray-600' },
      'V': { bg: 'bg-slate-500', border: 'border-slate-700', hover: 'hover:bg-slate-600' },
      'W': { bg: 'bg-red-400', border: 'border-red-600', hover: 'hover:bg-red-500' },
      'X': { bg: 'bg-blue-400', border: 'border-blue-600', hover: 'hover:bg-blue-500' },
      'Y': { bg: 'bg-green-400', border: 'border-green-600', hover: 'hover:bg-green-500' },
      'Z': { bg: 'bg-purple-400', border: 'border-purple-600', hover: 'hover:bg-purple-500' },
      'default': { bg: 'bg-blue-500', border: 'border-blue-700', hover: 'hover:bg-blue-600' }
    };

    const upperInitial = initial?.toUpperCase();
    return colorMap[upperInitial] || colorMap.default;
  };

  const getUserInitial = () => {
    if (user?.username) return user.username.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  const userInitial = getUserInitial();
  const colors = getColorByInitial(userInitial);

  return (
    <button
      onClick={onClick} // Use the onClick prop from parent
      className={`w-9 h-9 rounded-full border-3 ${colors.border} ${colors.bg} text-white flex items-center justify-center font-semibold ${colors.hover} transition-all`}
    >
      {userInitial}
    </button>
  );
};

export default UserAvatar;