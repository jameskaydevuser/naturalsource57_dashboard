import SvgColor from 'src/components/svg-color';
import { fetchCategoryName } from 'src/firebase/category';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = async () => {
  const cat1 = await fetchCategoryName('xGa0maZtHz6kIwefCQFn');
  const cat2 = await fetchCategoryName('gkF1xs9wzrvhQnlxlM2b');
  const cat3 = await fetchCategoryName('QCsxmPtXtUhQLjIoSIfG');

  return [
  {
    title: 'users',
    path: '/users',
    icon: icon('ic_user'),
  },
  {
    title: 'orders',
    path: '/orders',
    icon: icon('ic_orders'),
  },
  {
    title: cat1 || '',
    path: '/products?cat=xGa0maZtHz6kIwefCQFn',
    icon: icon('ic_products'),
  },
  {
    title: cat2 || '',
    path: '/products?cat=gkF1xs9wzrvhQnlxlM2b',
    icon: icon('ic_products'),
  },
  {
    title: cat3 || '',
    path: '/products?cat=QCsxmPtXtUhQLjIoSIfG',
    icon: icon('ic_products'),
  },
]};

export default navConfig;
