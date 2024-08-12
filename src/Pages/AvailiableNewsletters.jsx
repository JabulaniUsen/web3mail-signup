import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Notification from '../Components/Notification';
import Navbar from '../Components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faX } from '@fortawesome/free-solid-svg-icons';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { format } from 'date-fns';
import user1 from '../assets/user1.png';
import user2 from '../assets/user2.png';
import user3 from '../assets/user3.png';

const AvailiableNewsletters = () => {
  const { isConnected } = useAccount();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchField, setSearchField] = useState('');
  const navigate = useNavigate();

  const writerImages = [user1, user2, user3];

 
  const mockData = [
    {
      _id: '1',
      maillistName: 'Crypto Insights Weekly',
      subtitle: 'Your weekly digest of the latest in crypto.',
      date: '2023-08-01T12:00:00Z',
      coverImageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQBDgMBEQACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAFAAIDBAYBB//EAEcQAAEDAgQDBAYFBwoHAAAAAAEAAgMEEQUSITEGQVETYXGBIjKRobHBFFKy0eEjQmJjcnXwBxUkJTM2Q3N0wiY1U4KSovH/xAAbAQACAwEBAQAAAAAAAAAAAAADBAECBQAGB//EADkRAAICAQIDBAcGBwEAAwAAAAABAgMRBBIFITETQVFxIjJhgbHB0QYUI3KRoSQzQlLh8PE0ksLS/9oADAMBAAIRAxEAPwAovNnuhLjhKDhFSccUokjcEWLLJkZCahIucCbgzh7U5BlWTsR0wcidisCZM3ZcDZM1SDZKAoyUbHhqrko2PAXZIyKyo2RkVlRs7I0hUbOyIBCbOycQ5M46FXJw4KMg2SMU5ByJ2hXQKRM0IiBtkgarA8ncq47JE9uikvFlSZuikYgwbUN3XDtbBc4sSuHoMpybqrGosiO6owqCa8+KCXHCXHCXHCUEjSFdEkTkzBlhh8bJ2tkkbqynjkyOcQeuU/FaMKrHHdgybeM6Cu11StWV4Z5ebXIuQPZILsex37Jur8+jQ3XfVct1clLyeS0wKyJkTsCnIKROwLsgpMma1RkG2SBqjIJyHhiq2VcjuRQyNwixDZ24YWobLKQ0tQ5E5GEITLZOWVDsjmrslGTMBNrKyYOR2aupaMXqqiKIjk9wB9iNCLl0WRW62uv13g5h+MYdXVDqelqM8o2Ba5t/C4R3TZBbpLCFK9bp7ZbYSywp138xZVDsS4gjepLIqSjdSg8AbUjdSO1sFTjUrh+tlCXdVY3FkLkNhkFF58VEuOEuOEoOOrjhrgrIkicbAnojxZYjnY4Rty7vsL9Fe22Vc4Qj3tGNxzUXQ0Uvu7w3hZ71nw9obZhrWjQWtoFuPhEJScs8xCPFXCCjCKx3eQ19DbYNJ7woegur9Vg3raLHmUOfiupHl7M2lbbvB2VO3lB4sQ7VqZpehLcvB+t/knY3QHcciNimFJSWUNwtjYsxLDGqclWywxq4BKRM1igG5DwxcCcxBihkbxFmiozt4wsQ2i6mRuYqNF1Iic1BkgikMshNl8ie9sTcz3WHxXJZ7wU7FF47ys+eaa4hGWM9d0euty5QQvOWP5zx7F82MZQXFy6902uG2T5zYKOuqr/l1oZU4eBBI5hs9rSWkbgjYqHwuNSdifNZKaziUtRpp14xlP3Pqn7mE8AxOSupwyoH5ZjdXD8/vWdoNS768y6otCuf3au2X9S5+f8AnqFr6J5FSN6ksitNspQaINqeakcrBNRuVw9WUZN1VjkGQO3VGHTCi88LCXHCUHCUnHVxw1xspRJLR04qJr/4cY9IdSn9HS7Zc+iEeIap0Uvb6z5IZiNu2byIIFuiBxDlbCXg0Z1i3cL5/wC8zQA/Be4XNZMSUMM7upBuJXnaHNIIuEnq6VKO4PRKUJJoGiX6NIDbNHfULzcrnpZ5/pZvSrc4dtX63xC8GV7Q5jszXagrXjJSSku8GrVZHci0xqsClImDNFwCUx4YuBOY7IuwRvEWKMHbxhYqNF1MicxDaCxmQPYgSQaMivUvZDGXvNgOXVCm4xTcuiJlY4rksvuBbHOq5TI86ch0QtO5ah7nyXcg0oLT15bzJ9/yCUDQ1ui9Tp6lCBgWOUnmRONkcFgiqnWp5f2D8EDVPFE37H8C3ZvDBGDktyvG7dV5DhK9DzN/V+jooLy+DNbHIJIw4bka9y2Zx2ywZtct0UxrlCClaY6KUFiDKk7qRusFVB1K4erKEh1VRuJEd1RhkwovPARKDhLjhLjhFSiRruvRWim3hHPGOYWw6Ps6AH/qEuPwHwW/o4qGlT8eZ5bi9u/UuP8AasfP5gnEzo5YfFZdEN6hbeFy8g5DJniY7qLr3VU+0gpeKXwAdirIKfjz/VZJM2iJgXlRzwRSO0QL5YiwsNPgG1YDmuB9i8nq1vhJG3pYYWCTh+qBmfSO56x9x5onCbJSpw+4wZS7LUSj3GkY0fBa6JlIma1SLykSBqkG5D8q4puGlq7B24aWqmC6kROaqtBlIhfHc2QJIPGRl8aq+2rvo7P7OL481kcUbUFDxZfRS7XVr2E1Lo0J7TcmkuiNXVQ3F+N2i9PU8xRjT05JmRCkdOVMSky0M56sI9uiR4nLZo7H7H+/Itqq1Vppzfcvjy+ZQwvcDovK8K9RLzH9as6GHkjTUb7tIW/Z6UFL3GNQ8SaJXlAQ2ipMd1IaIMqXbqUMwBc7tVI9ApSHVcxmLIiUMMmFV53ANCXEiXHCXHCK44jfsrpFkGwctJGzpGPgvQReIRXsR4rUvfqJvxbBFe3NRyz5vVkYy3XMHG//AKrA4hHevJ/E0eLWdnoNnin+2C1hUuaghPRgHs0XqdPc4VxT7kX4RPtdBU/Yl+nIvZ9E7HUZHnUiNzkpqbE0RswUqk6Lz2ol6DHalgDx1DqfFIpG8nIvBY50zftPGa+zGtZ6HAWujaW7OF1sIYc8osNCsAlIeBorJAmytWYjR0MjW1dVHHI7Zrje6htLqVbJaeqp6kubBNHIWesGOvbxVYTjP1WS3jkSEKzRKYxwVGgsZFOuk+j0ssp/NbdDayFlPEGzz6lkMlRI927nXWNxqO2VRbgk86toOwHQeCLTLoz1FscltjrBegot9EU7PI7Ojz1CRdVpA3G5QKIjm5wA+PyWRxKx26ecV/uOZjfaKzstA/a18c/I7SsEUVM5rs3bR5yenpOb8ljcNxCKS7/qx5Sd2h5930Qco3/lGrbz6LRh1cpIsudYWQ8mgkU5nbqyCRBlS/dWQzAFzu1UjcGVJHLhiLIiVVhYsNFuqwXA5SGkIe0smIiy7BxxdgkarJHDHusESMSyC0j/AMk39kLXcsQR4+uvfqmvawbijsuFRfrJnuP/AGhoHxKw7G5ygvGXwSO+0tm2iUPBL92/oNwGXNQgfVcR8/mvSa2LpsUfYvp8gn2Xlv4dFf2tr5/MJdpb7+iAtRg9DtyRz1WjW6Cwtp43Suo1SSeXg6FWMsDV+KRxOyndK0aPU8SjmHow8X3mHxDj9Wnbqojul346IDyVvaSgja916PT6BaPTdlnLPILUW3ajtLI4PUcEl7bC6Z/6NvZohxeV/vfzNuuWYII3DWOcb2AvoiYyUk/E8+m4txQyvqWSRsYR6MWQFtvZc+1Bqlu1bok+h558Wm3yXU88qcZq24rLUSV/0mTW0su9zuNN+XlYACy6+EN8oZyjconNxUpLDLWE8bYnh+JvfFFCyX1Xh93NI07wujNpKHcVVEd7nl5Z6jw7xY6qpoTi/ZslmcGxugY7XxFyferztp+8zpqeUvohhVS+7K98llrr4f78+/C1hGt+5SyqkAuLZjBg8pH5xDUMmyXonm9NWsgPpG2qvr+Fx11MVGW1x8TI0+sv0tzsis55hzD8TZK05Xarzt1Oo4dJQvWU+jXQ9pw7jVOu9Ca2y8GFoam8ZbZpzEG/MW5eGq0KdUscjWdWJZHGX0Siu85w5AjH5bMp4/rPJ9g/FHprd1V3sXx5/I8j9r5409cPbn9OXzLtM7NhtM/6kkkfl6LvmV57STcYrPi18H8zV4PJW6Zx9ifxCuHvvIxbqeY5M5w2W4CEjtPJVTG0UKh2inISIKqH7q4xEGzP1VkHiyo52qkNGQ26gMpGlfEs6dRWNhGY0B1BFMYWIfZl1IYWrthZMYQrKBOSJ+1+iuoF1zZZM14GHS4aLX7l2r1HZ14MmmhQvnN97b/cE4hO4xhpccouQ3pfdK8FolqNUs9EeR+1WqU5KER/C8hdFUxjlIHe0fgvW8ehiyEvZj9P+ml9kmlppx9ufl8gnN2n5vVeZu7Tb6HU9a3hcihVMlcTcvB5EFoHtNz7kuq6q4qWoWX7W8fsY2o0upvb7WxqPhFpL3t837kY2unkdjFRSPDrxgHVwcNe8AfDqvRaayd1UNnTHLCwv0yzzUaKtO5Rj0y+/P78vgTRxPDmEbl1lpuicK8sTlqarJuC6nsHD0ElPhsUb/WbsfGyRTTXI0oJqOGQ8T45HhlJJE1okqHsIDc2jQRufuUxsTs7LvxkBfPZHJ5FxHVzwYeymv2Urhd9xchv3/crXOjtpX1vLly9y6mTo+Hzhe5XLGPiZVtNJLlkfnibqGlzwDbw3O2wb96Xx4m05LLGStqO0jY8sdm9FkgdcXvpqPHnr6SlrufQmLyjQcM4i95ia6VrW05MpznRp2J8APimtNTprY2dt/bjl16rp7V3eYO6+2pR7LxR7nwuZ5MHjkqD/aEujF72YRp/HglNPXOEcTeX5Y/YZvu7azdtUenJFLjWB8uEns92Bzz4BF5Z5i9qzA8nfG7swQLi/VPS09kq00J16qpSce//AIdwOaSTF5aRrXAsjz+tlHtsf4usbW3uunFiTWe9Z+ax5j0NJVqLoKXJ+KeP3wzXwNnGn5Tl69jfwI+4LClUpRU9P8eX7np9PRqqZbYzco8vWw/0ax+6L8Qdb0uibqc5L0+TNSWAHxHL/T6aPTRhdqOp/Beq4PV2mmtfjy/T/p4P7XPdOEfBfH/hZoZ3GOxeSL3tfmvBa6E9NqXEb+y+rj2O2XU0GDu7ScDo0lbWluVkDW11K7VSQSkfpdMJiyB1Q/dXTCoE1MmpV0FTwDpX6q6LqRVc/VWwWUzmddgIpm6fEqSgBjYQPhQpVh42kL4kN1BY2ELo1TsgqmROYu7MIpED2qNgSMiOR1oyFm8QqnLDj0EdfYqYO19ANXPuCO5el+z2kddeWj5ZxKxW6jl0HcLT5cQqWfWY038Db5pr7QvOx+DaPY/ZqO1Sj4pfty+ZqJZu1yn6rGtPfYW+S83KR6uFe3Ptbf6sG1j7RvIF9NllWJ26qNecZZm8ctsq0rcVkymFQtnxnERPHIJTlc1ztiywGnndep4jrrOHJupdWl+3Vd36HhoaWepoioSSx1wF5I+zy2F8rgRfqNUtwvX6jVTatecmY6VprU13HpOCn+r6d12kvYHAjnfUfJaK5Z5Hqa8bFlgLjeCSjhkxaOLtGxNu8Hdp5fIeazNVopWamNkemHn9BiWslXTCEY+lGSxyzybWcnj+OYsyuqp3sY5natYWAixDsrhb2ke1M0wVVShnOPq2+Wf+9RaUpW2O2fWT7nkjNDHi8wrZKmFz5iAYY9HEl2o7t9+VgivGNz6f708WL7+ySi1hePcvMrY7eKWopM/a5WsLpBsZA3KS3xHwXNvasrHJcvcWqUcbk89f0yNwKlkrap9QwjMM0xa71XFpJt52HnZRF7XuzjGPil7vHISUsHvP8nOJDEOHezeC2oppnxTMP5pvfTuP4ckSD9ErHHcXeLS5mDvnaW/k3AWd+dfQD2kK0Y7ntwVvnsrcvA88igYWBgaC2wWTr+K6qjUNwZ52jSdvPk+YJyNp+Jg2njf6NOBI/wDNNyC34FP0XS19Ep2JR3RfTHj7TUvqlpaUpPc00a6mcSLk+S8roptSks8j6Hw+c7NPGU+peZOY4pANntDT4XB+S1d3J+0PKvMk/D6GPx2cPxxzR/hsa0+8/Net4HJfdn7X/j5HhvtNFStfsSXz+ZboHgC52GpXn/tFopSluRi8F1EabnuNjgkWWlMzhYyeqP0evms3h9c417pd/wAD29l3a4x3FmZ2i0AaBdS/dXiXQHqZNUWJbIPlk1RUirngruk1V0iO0G9opwSrD1B8elyDbrfRWcQUbCrIYQbGWMHoXBUcQ8Zsic1rhduveFTagymQPjVXAPGZBJGqOAZTKz2KjiGUitLHdrh3IbiTbXG+t1S6S5MzNXJ6Lm9LhevrSrjn/eh8foqlOxZ7irgdSIcaiv6sjXMPsv8AJeX49ZKdUmu7mez4db92sUvcbAS6XO68j97m0elXEqWRSyBwIKWTlOeTO1+rhdHBVaQy4C3rYXamuKl3Hm1bXRnaV5ZN9bLZ4Vo3VhtHndZd2kuRpuCcYAvhdS9rXC7oHO59W+PPzWpq6tkty6GxwvVdpX2c+qDfEn5eCCkLbtkdmeOrWi9vbZZmpjZOcK63ht5/RP5m7Rp6boTld6vL9/8AB5rxlwx9Ic2tp2sbPmDXB+gcORPtS0IW0zdNmcPo/wB2vjhheI01qfa1P1uq9v8AkyNdC+iLozC+kka1rjZx0eWAuGx5k803lS9JdDPwC4qWrqndjA18skp10PpDx6fgqN45tkm94T4aNJUwyVhzSBwyRNGmbltvZZ9/Eqc9hW92eXs8vf0z7RrQ0qeojOx4S5+3KPROBMIq8M/nOeridCauoztjda9rusdP2l6K+VahXXXj0Us+feZ2ZTtnN9G+QH41xptZWfQKV+anp3em760nd3C5HiSiaWnKc2ZPFNSv5cQHC8CxKweKaGVkm0LcPvUGTXa9+ZZr7WnT7Irkb2+u6abLcUoAsFhRnKt5R6jSa6uuCiyTtdNEw9XLGBuXE6kYmrqu3xSpkHOUj2WA+C95wex11xg/BHk9dL7xKU13hrB2iqrqaA7SPa0+F9Vra6KlTKT8Dy9ND+8xh3Nr4nozi1rQ1ugAsAvJR6HvPIo1D91JZAerk3REWzyBFRJqUaKBykVQyea5gglkHVjCQjpAXMhlp6uPWSmnY3qYyEVIG5Mrk3NgC7u3U4wQrO42WRWkzV3HQ1LyZw9jiw5m79eiWlLAxBZCEEgmbr69vaEaqzf16lbIbHy6CkYrtExkVJGaobQxGRUqS2OKSR/qsaXHyVY1b5KPiWsuVdUp+CbMLUShwced1vam9KOT57pNPhJgs1HY1DJRvG4OHkbrz1qViafeaUo7ouPibZk+dtxsdlg38JlDoecr4hYnhs66XRW0nDm5JsNPXSa6lOea1zey9rTRGuKyhbtJWPByGpYHujOUyBoJzC9rpjbmWIi/YuMVZLo+S9xXfN2ZZKx5bMx2ZpA2PUKdRjY0xvRVT3qSR6lw3iLccwamqZo2mU3bJ0DxpceO/msiPPB6TLSM5xJh0lbUTRCadkeYizDZtu/ySM5Q7RysXNd+MmXqdTdTbthHcsf6/ADuo6+OhqIqZrJnMfG2J0zc7rZAHXJ3NwPeq4rk9/R/pnzHFbTOG+yW1ePP3dOf+8wNhmGYnSYgyaoOUOna15c/036ja3Lfc+SvqanLTy3LKw/aVWtolN11yy0m3jPd8z0fhLCp6AmeseZJqjtJQ1zs3ZMu3IB00187clOm08K1FpYePoHVrnBL3k3HWNS4ThAFOXCpqX9kxwPqi2rvHkO8hNtrKKvOHg81p5GXaA+7ifSvt7ea26knDETzeprkpNsmlqo3S5WgBwbmsENRSbUgPZSeLscmySCbMLpLVaaFlbwhjtpQeC02TReKv4fLc8DUde4rqQVlV2FNLN9RhKPpuFNvdIGtZO22NafUx1LJdb1ctjWD0OOXMO4VVfR6ynnO0UrXu8AdVubldVKHjlGbZVssjZ4NP4Hqcz7E9CvMdXk9KC6qS11KLAWrl9bkOqJFESlhBDAsIZJH9MrGtfm/so3bW6lETLQhlbmaRpAaABYDS3RHizmhwcjRYNo7mRUVM0UKQVTElZh4sQCXkNQZNA/s5Gv5A6+CHCeySYaUN8cBORuoI2totTrz8RGLxy8CpK3uuqNDEJGf4qqBT4dlDrPlOUHoOf3eatThT3eArxO3+Hdce8wk8hLbkWF9B/HkqX2b2YaWOgOnddARJqsEqe3wyB3NoLD4jT4WWpTUrqE/DkeS4jV2epl7eZfz6LqtGosU3voV5G5ynpQysDNU3FcgfUxyxVDqiENL5G2dm206JXUb4WOyHV9TU0nZzrjTPp3F3h7h3GMSmbPNURmlLbaxBov3c0nG2x82x/sIvlFdD1PB6SLDMPjpYdWMubnckm5KhdRlJRRPSNbnqg8AgyX1CDWsuRE4uL594ylaPpbyWNsJZCNP2VZYU8eZWvnXnwfxyySvp6aSOaZ0DHSNY6z3M1GhXXfypeTFp1V5c2lnHvOwEdrS2O0BFuvqqK1yj5F4ckvIq8QYRDjdD2Er8skbs8Ulr2PSyIniSZeS3RweT4/gOPYNUOfLOwU7n/kgImuB7rjVWlfYnuiyipg+U48/EipIHdvLPLYPf6IaDoB/Fk9QpOUpz5SfIzNXKO2NcOaXP3l+IZDZMbPRwZlst3Mnz+iUhLR5lkA5csAfieoy0TYm+tM8f+I1+QUaqEaq0l3mnwevdfvf9K/wZ+nfzGyyz03cEoZLBOae7Y8MHOO5YPTsDrvpuDU8ma72jJJ+03T8fNJ3wSsftH6ZZgvYRVklroaQXIMpoTW4hFANAXXce4bq7e1FYrfLBsm2Dco0ty6dyHBmg1+w4FNRYGSOgpiLBSR0myIgbM1nuplEVrtyODkrOI/XPI4FLSQ5CQ7x2S8kNwlhoLUju1pGOO49E/x4WWlRLdBewRuWyx+0bK3Q7X71domElnmYbj1sjKimkDT2BYQCNg7oe+1kGTwI8QUt0X3YMVPJcFCM8pyu28FxwX4XqbfSIOVw8fA/Ja/C5Z3QMPjFW7ZP3fQ0Ge+i1tqyYe0YXXeWNcM4Fy0HW3gl7LYRe0bqonJZUeREWOkadu/XklbGuiY7StvNZNrwrM9mFtY9uXK4gDrZIRhtyjbrs3Rzg0DJ9FdLmQ5E0bsjnfpG6XoXreY1rJejV5HIn2Jd+k75Ll669/xQJx2Uy9u1/qmPmkzQvH6JRLl+HLyYtSlOyMX3tL9RrH+lF3R2+CpD+ny+h1kdrl7Hj4k4k8PNXaIUjKfyhPe+ipYQLtc43J2B01URjmSOnZtiYnK5hDbNFzoFpVzSRkWwUs8mSB9nuYXAvb6zQblvim6rYT9ViV1EoY3LA7PpbqjOKF1Bt8jM8SVPa1zIj/ht95/+BYfE55tUPBfE9HwmpQpcvF/AoROss41C9DLbcG3NccbrgoytwuaR7SI3yDJfnpr8h5LpPIanoy5Wy6OUYCtk/DEeaSep5WDG/E/JB1EsYgM6KO7MvcaAFUgx5oeHJuDASR3MmIgJCzI6ANmUbImZxMaqwnY9KTiaVVhK1yUnE0qpjwefRAceY7CQSwp9zJHysHD5o2lfWILV90izI3VOMBFlKpijkY5krGvYd2uAIKE0MRxJYayZTi3B6OHA6mamw+FsjAHB0cYBAzC+vhdDkkhbV0VqiTisM80kd10O6EZBNgtR2OKRX2fdp+XvATOksddqaFtVWrK8M1jHHrYjZbynnqYFlPgRzwxzm8sTJT1e0EJezEnkPR6EcMgZhcRlZLDTiN7XAh0AyO9o/FIairlnBoUahP0epv6WQRRMYLkBo1NrlRFckMvCXQux1NtUTACUi7NLkjhPWO6W08ecvMZ18vRq/L9CQy5Yb9494KiC/Ex5/FE3z/A90PgyNs2Zwb1KNdH8OXkxHSWfj1+a+I8y+ke4kIUFzj5fQPdLlb+f/wDRKyY6W3RGheMwdxSwT4PPmMgewadnvdCkuQaDyzy5mFwxXL6eIk3zGRuZxPeTumaaVhMDdqE3t5/AtQMjibljjYwdGNACeqSi+gjfFzxz/ccXao0rOeCldJjayft62aXk55t4cvdZedtnvslLxPQVVquCj4CjdbXlbXwQwh6/hOCYczB6F0+G04nFOwyZ4QXZra381wVItVLwxga0AADQAWAC7BbKSAFdLqR1RIx5g5SNHgcXY4XD+s9M+f4WWbfPdY/YbWjhtoj7eZeDlMGHkPDk3Bi8juZNRFpCzJiIvJmRaU8zz9bJ43JaaNGqRYY5KTRp1SJmlLyiPwkW8OkyVcd9ibHzVavRmi9vpVsLyN3J3O6fEoMqyBUYzBlSVua4IuDoRa6o0MI8m41wv+bcWe6GHs6SYB0WUeiNLEe0E+aBJGJq6eys5L0WZsSGORsg3Ycw8QoTw0/AUfNGzp5hLEyQbOAI8CtaFvIzbKOY90hAJCrZdjmdXplJYYUwGoLzKXZbRNvpv3e9JOfbTWRmupVckFWT8/I96cS5EWPBMyptqiJc0JzkFcSlyRUffACldKvX8xriMvQq/L9CaeXLht/0IfeHLoL8T/5fIrqJfwvuh8GV6KbPVwt6yAe9GvX4cvJiOkn/ABMPNE7pLCY9JrfFCiucfL6B7Z+jb+df/YliluFZoBGZYdaWJzHWyka3Q3HIxGXeed8RvNNiT6c29HohVWutuI1OlX4kwaJLi6fha2si89PtZWxGp7CimkG+WzfHkqXW+gwlNPMyMWmW/XVZY+bn+TfB21dZLX1dP2lNC3LFn2Ml+Q5kD4qUcejTS72OnQ7qcF8getl0PirpFXIAzk1EzYW7yPDB4k2Cs/RTfgDXpSUfH58jcgBrQ1vqtAA8Fgp7uZ6qMdqwhXTMCjHBycgLyO5k1AVmLMmIisjKtT0mYcIk7EvJj1aJ2JeRoVkrSl5IegyVji1zXDcG4QWsMZjzWDREhzGuGxAITyeUILk2vAryDRQHgypIFVjMWUaqFk0bo5GNexwsWuFwQqNF8KXJnh9dEYKuop+ccr4z5Osl8Hm5R2vHhyDWA1bXwCF5s5mg7wmaZ/0gbFhZDJgJ9Yb80593chJ6qMS/htO6n7eU7FoHvCXdahZgYrtlas45FpsqZSKWjxPZES5oSl1DeOv7Onwo9aVp+CV0q5z8w/En6FX5foWax+XAyf1dN72uU1r8X3y+RTUP+F90PgylhEmbFaQfrmfaRrl+HL3iWlf8TD8y+KLkz7NrO6rI+0hxjzj5fQvbL0LPz/UfBLoFaSBQkXY3gjVDwMxkYTiKle/FqmV/5z9PBCqpVkmPSvdcUCjGWHTdMumUSFqoyM/j9U14ZBFrY5iUhbNSeEOQXIj4VpY67iPD6aRge10t3NOoIaC4/BCXUsz28ua1oDWtaALAAWsEXBCfIpVEtgV2DsgOum3V0ijkVcBj+lY1GOUYLz8B7yEDWS2UsY4fDfqY+zmbJ7rnTZYyWD0o3MmYA2dDk3AWmdLk3AWkIOTERWRnWtTTZlwgTNbogSY7CBK0ILY7CJK1AkxqCHjY2QmMR8QzhVR2kHZO9Zmx6hMUzTWBe+G2WV0ZPIEYrFlSUKgxFlKYct1VoMmYDjDhaWqqZK/DQHyP/tobi5P1m359QgyiIavSOT31rPiZuhw/E6WpY4YdMS0m4dGdR56eG26qovJndjb/AGs1tG2oia0lpb1DrX9ydV89u3ArLhsnPc0TzzkjKcoHRq6EccwzrjBYRB2iYQlYd7WwJ7kSPUTn1NHxSclJgn6VAw/BB0y9J+YXXerV+Ut1zrcN3/VUX2HqK1+J+oO7/wAuPZD4MGcPvvjWHjrVR/aCPZ6kvf8AASoeL4+a+JfqX2/nDuxAj7aHFdPL6HXS9Gf5/qKmk0KmSBRfMvxvNtEJoaiyviNA2tAeHAStGhIuhSi87kxqE/R2tcjLYpg2KtY+TsfpGXUNie038nfcpstslHGAtMK4yzkxMuBY3UVBzYTVCRx1tE4WHS50AFvfvZJbJeA/vj1ybvgjhV2C/wBYV5a6ukGVrAbiFp7+Z08ESMcFJSyaiR4A0v5q+CuQZVS2BUpHNgCtm1Kvh9xRsOcK0ToaV1VJ60/qg7hv47+xZOvtUpKC7vib3C6HCt2S/q+H+Qy4pKKNRjbpmAOQgUzEBI7dNQYrNHMyPEWkgS1uiO5C0IErWILkNQgSBqC5DcIDwENsOojgEJsMoj43uicHtdlI2VdzTyi7gpLDCcddHMPygDXW16H7k1DUwfUVlppRfI49zXeqQfDVFTT6M5ZXVFSYKAsWDpgbmwJ8AqtpdQmG+hSlikOrWPJ7mlV7SHiirhJ9xRqI5G6vY9o722RIyi+jyJ2xkuqwD5H2NkxEzbCFz0VCFhwPREJSWWanjF39B4e/dzPgEGjrInVPMK/L6FvEn/8ACjv8mg+w9RH+avf8ilv/AJ/dH4MEcOv/AK+w7/UxfaCNZ6khOlfjR80EK5//ADD94u/3qkO7yIt6T/M/mMppNCrSAoJQyaITGYMsNcTshsYiS9lM4aRSEdzChOcV1Y3Gm1r1X+g0wzDeF48WFV3xfRhVVZ/a/wBCF5e31mFo7wpyn3k4a6opzyW5E+C4kGzQ1dQS2Kmmf0s029uyiVkIrmwkabZ+qmS0PDpMjZcRLdNexabgnvKRu1yxtrRp6XhjTUrufsDbztoBpYcrBZnmbuMckuQwlXRDOXR4gmK6YiBkhXTEWLyQ0lMRYrNFJiuysIokGyDIbhFDwhyDpDghMMhwVGEQlUIhKrLiVGWR0KrLCUFkJVJQgqt4LAXH6SD6IahsYbJnDbt0vutDQXTlPa3yMfi2nrVe9LmZhxOg5LaR5mxc35jTsVddRORqeMT/AEHhz92s+AQa/wCopqfVh5FzEv7pH/Iw/wCxIuj/ADv1+RF//nflH5gbhv8AvBhv+pi+0EefqSE6f5sfMI151xD95u/3qke7yIu6S/N9SOnOgVmA7wlCSMtuZQmGj1SNdS00VPG3sm2Lhck7rFuslKbTPaabTV0QWxFgIQwIqGcNKqSiCRVYSJUmQpB4lKVDDoruUosMKuiDgRYlWdRogJHOaagLyOFHiLSP/9k=',
      writersName: 'Alice Doe',
      writersImage: user1,
    },
    {
      _id: '2',
      maillistName: 'Blockchain Today',
      subtitle: 'Daily updates on the world of blockchain.',
      date: '2023-08-02T12:00:00Z',
      coverImageUrl: 'data:image/png;base64,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',
      writersName: 'Bob Smith',
      writersImage: user2,
    },
    {
      _id: '3',
      maillistName: 'Web3 Innovations',
      subtitle: 'Exploring the latest in Web3 technology.',
      date: '2023-08-03T12:00:00Z',
      coverImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlAGAemMmyLHNjzD5GOett07BxJG7pQ0FVrAMmrOKJkskE_0w5QIYQR2JShQ&s',
      writersName: 'Charlie Johnson',
      writersImage: user3,
    },
  ];

  useEffect(() => {
    setLoading(true);
    try {
      const formattedPosts = mockData.map(post => ({
        ...post,
        date: format(new Date(post.date), 'MMMM dd, yyyy h:mm a'),
        writersImage: writerImages[Math.floor(Math.random() * writerImages.length)] // Assign a random image
      }));
      setPosts(formattedPosts);
      console.log('Fetched Posts:', formattedPosts);
      formattedPosts.forEach(post => console.log('Post ID:', post._id));
    } catch (error) {
      console.error(error);
      setNotification({ message: 'Error fetching newsletters', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePostClick = (post) => {
    navigate(`/post/${post._id}`, { state: { post } });
  };
  

  const filteredPosts = posts.filter(post =>
    post.maillistName.toLowerCase().includes(searchField.toLowerCase()) ||
    post.subtitle.toLowerCase().includes(searchField.toLowerCase())
  );

  return (
    <div className="lg:px-20 px-5 bg-[#050122] lg:pb-40 pb-20 py-10 px-2 relative inter">
      <img
        src={bg1}
        alt=""
        className="lg:block hidden absolute top-0 right-0"
      />
      <img
        src={bg2}
        alt=""
        className="lg:block absolute hidden bottom-0 left-0"
      />
      <div className="lg:p-8 py-8 px-5 rounded-2xl w-full mt-10 m-auto">
        <div className="mb-14 max-w-[35rem] m-auto">
          <h2 className="lg:text-3xl text-2xl font-bold mb-2 text-white text-center">
            Web3mail Newsletter
          </h2>
          <p className="text-sm text-white font-thin text-center">
            Join a community of over 10,000 creators, operators, and investors as they explore the cutting edge of consumer crypto and the future of the internet.
          </p>
        </div>
        <form className="space-y-4 max-w-[35rem] m-auto">
          <div>
            <div className="relative">
              <div
                className="flex justify-center gap-3 items-center p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white border-2 border-[#3c77fb]">
                <FontAwesomeIcon icon={faSearch} className='text-gray-400' />
                <input
                  type="text"
                  name="searchField"
                  placeholder="Search posts..."
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  className="w-full outline-none bg-transparent"
                />
                <FontAwesomeIcon icon={faX} className='text-gray-400 mr-2 cursor-pointer hover:text-white hover:scale-[1.2] transition-all' onClick={() => setSearchField('')} />
              </div>
            </div>
          </div>
        </form>
        <div className="lg:p-8 py-8 px-5 rounded-2xl w-full max-w-[68rem] mt-10 m-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {Array(6).fill().map((_, index) => (
                <div key={index} className="skeleton-wrapper bg-[#0c072c] rounded-xl text-white transition-all hover:shadow-xl hover:bg-[#221b50] ">
                  <Skeleton height={160} className="w-full object-cover rounded-t-lg" />
                  <div className="p-3">
                    <Skeleton height={20} width="80%" />
                    <Skeleton height={20} width="60%" className="mt-2" />
                    <Skeleton height={15} width="40%" className="mt-2" />
                    <div className="flex items-center gap-1 mt-5">
                      <Skeleton circle height={20} width={20} />
                      <Skeleton height={15} width="30%" />
                    </div>
                    <Skeleton height={30} width="100%" className="mt-5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {filteredPosts.map((post) => (
                <div
                  className="bg-[#0c072c] rounded-xl text-white transition-all hover:shadow-xl hover:bg-[#221b50] cursor-pointer border border-[#453995]"
                  key={post._id} onClick={() => handlePostClick(post)}
                >
                  <div className="relative">
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-t-lg">
                      <p className="text-center text-white relative">Click to view more details</p>
                    </div>
                  </div>
                  <div className="p-3 flex flex-col justify-between">
                    <div>
                      <p className="text-[#808080] text-xs">Web3Mail - {post.date}</p>
                      <h3 className="text-xl font-semibold mt-5">{post.maillistName}</h3>
                      <p className="mt-2 text-[#808080]">{post.subtitle}</p>
                      <div className="flex items-center gap-1 mt-5">
                        <img
                          src={post.writersImage}
                          alt={post.writersName || 'Unknown writer'}
                          className="w-10 h-10 p-1 object-cover rounded-full border"
                        />
                        <p className="text-xs text-[#808080]">{post.writersName}</p>
                      </div>
                    </div>
                    <button className="py-2 bg-[#3C77FB] text-white mt-5 rounded-3xl w-full mb-1 hover:bg-blue-700">Subscribe to Newsletter</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AvailiableNewsletters;
