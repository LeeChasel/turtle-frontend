import { useQuery } from '@tanstack/react-query';
import getNewArrivalProducts from '../actions/getNewArrivalProducts';

function useNewArrivalProducts() {
  return useQuery({
    queryKey: ['newArrivalProducts'],
    queryFn: getNewArrivalProducts,
    refetchOnWindowFocus: false,
    // Sort banner products from high to low price because the data are random order
    select: banner => [...banner].sort((a, b) => b.currentPrice! - a.currentPrice!),
  })
}

export default useNewArrivalProducts