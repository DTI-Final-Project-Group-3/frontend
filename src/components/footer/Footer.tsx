import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="bg-black text-white py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Warehub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
