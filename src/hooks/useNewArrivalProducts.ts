import { useQuery } from '@tanstack/react-query';
import getNewArrivalProducts from '../actions/getNewArrivalProducts';

function useNewArrivalProducts() {
  return useQuery({
    queryKey: ['newArrivalProducts'],
    queryFn: getNewArrivalProducts,
    refetchOnWindowFocus: false,
  })
}

export default useNewArrivalProducts