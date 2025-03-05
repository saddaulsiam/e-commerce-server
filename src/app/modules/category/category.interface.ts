export type TSubcategory = {
  name: string;
  href: string;
  subcategories?: TSubcategory[];
};

export type TCategory = {
  name: string;
  subcategories?: TSubcategory[];
};
