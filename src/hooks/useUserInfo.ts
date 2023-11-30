import { useQuery } from '@tanstack/react-query';
import getUserInfo from '../actions/getUserInfo';
import useUserTokenCookie from './useUserTokenCookie';

function useUserInfo() {
  const { tokenCookie } = useUserTokenCookie();
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: () => getUserInfo(tokenCookie!),
    refetchOnWindowFocus: false,
  });
}

export default useUserInfo;