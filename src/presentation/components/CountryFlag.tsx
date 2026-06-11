"use client";

import { useState } from "react";
import Image from "next/image";

type CountryFlagProps = {
  countryCode: string;
  size?: number;
  className?: string;
};

export const CountryFlag = ({
  countryCode,
  size = 24,
  className = "",
}: CountryFlagProps) => {
  const [error, setError] = useState(false);

  if (!countryCode || error) return null;

  return (
    <Image
      src={`https://flagsapi.com/${countryCode.toUpperCase()}/flat/64.png`}
      alt={countryCode}
      width={size}
      height={size}
      className={className}
      onError={() => setError(true)}
    />
  );
};
