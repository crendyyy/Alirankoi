import React from "react";

export const FormatRupiah = ({ value }) => {
  let rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  return <span>{rupiah.format(value).replace(/(\.|,)00$/g, "")}</span>;
};
