/** Global stacking order — higher overlays use createPortal where needed. */
export const Z = {
  header: 50,
  platformToggle: 60,
  cafeModal: 70,
  mobileMenuBackdrop: 100,
  mobileMenu: 101,
  cartBackdrop: 110,
  cart: 111,
  cartToast: 120,
} as const;
