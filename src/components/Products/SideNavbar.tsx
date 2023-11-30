import { useSearchParams, Link } from 'react-router-dom';

type CreateLinkFnParams = {
  key: string,
  value: string
}

function SideNavbar() {
  const queryString = new URLSearchParams();
  const stringArray = ['minPrice', 'maxPrice', 'sua', 'sort'];
  const selectedQueryBtnColor = 'bg-blue-200';
  const [searchParams] = useSearchParams();

  // TODO: Validate don't match query
  // const priceArray = ['0', '199', '200', '499', '500', '999'];
  // const queryMinPrice = searchParams.get("minPrice");
  // const queryMaxPrice = searchParams.get("maxPrice");
  // if (!priceArray.includes(queryMinPrice!) || !priceArray.includes(queryMaxPrice!))
  // {
  //   if (queryMinPrice && queryMaxPrice)
  //   {
  //     // not found
  //   }
  // }

  stringArray.forEach(item => {
    const queryStringValue = searchParams.get(item);
    if (queryStringValue)
    {
      queryString.append(item, queryStringValue);
    }
  });

  function createQueryStringForLinks(paramsArray: CreateLinkFnParams[], nonPrice?: "nonPrice")
  {
    const newQueryString = new URLSearchParams(queryString);
    
    paramsArray.forEach(params => {
      newQueryString.set(params.key, params.value);
    });

    if (nonPrice)
    {
      newQueryString.delete("minPrice");
      newQueryString.delete("maxPrice");
    }

    if (newQueryString.toString() === "")
    {
      return ""
    } else {
      return "?" + newQueryString.toString();
    }
  }

  function createPriceClass(minPrice: number, maxPrice: number, nonPrice?: true)
  {
    const queryMinPrice = searchParams.get("minPrice");
    const queryMaxPrice = searchParams.get("maxPrice");
    if (!queryMinPrice && !queryMaxPrice)
    {
      if (nonPrice)
      {
        return selectedQueryBtnColor;
      }
    }

    if (minPrice.toLocaleString() === queryMinPrice && maxPrice.toLocaleString() === queryMaxPrice)
    {
      if (!nonPrice)
      {
        return selectedQueryBtnColor;

      }
    }

    return '';   
  }

  function createSuaClass(value: 'true' | 'false')
  {
    const query = searchParams.get("sua");
    if (query === value)
    {
      return selectedQueryBtnColor;
    }
    else if (!query && value === 'true')
    {
      return selectedQueryBtnColor;
    }
    else if (query !== 'true' && query !== 'false')
    {
      // TODO: not found
    } else {
      return '';
    }
  }

  function createSortClass(value: 'asc' | 'desc')
  {
    const query = searchParams.get("sort");
    if (query === value)
    {
      return selectedQueryBtnColor;
    }
    else if (!query && value === 'desc')
    {
      return selectedQueryBtnColor;
    } 
    else if (query !== 'asc' && query !== 'desc')
    {
      // TODO: not found
    } else {
      return '';
    }
  }


  return (
    <nav>
      <ul className="w-40 gap-2 bg-gray-300 menu rounded-box">
        <li>
          <h2 className="menu-title">定價</h2>
          <ul>
            <li><Link className={createPriceClass(0, 199, true)} to={createQueryStringForLinks([{key: 'minPrice', value: '0'}, {key: 'maxPrice', value: '199'}], "nonPrice")}>無限制</Link></li>
            <li><Link className={createPriceClass(0, 199)} to={createQueryStringForLinks([{key: 'minPrice', value: '0'}, {key: 'maxPrice', value: '199'}])}>200元以下</Link></li>
            <li><Link className={createPriceClass(200, 499)} to={createQueryStringForLinks([{key: 'minPrice', value: '200'}, {key: 'maxPrice', value: '499'}])}>200至500元</Link></li>
            <li><Link className={createPriceClass(500, 999)} to={createQueryStringForLinks([{key: 'minPrice', value: '500'}, {key: 'maxPrice', value: '999'}])}>500至1000元</Link></li>
          </ul>
        </li>
        <li>
          <h2 className="menu-title">商品狀態</h2>
          <ul>
            <li><Link className={createSuaClass('true')} to={createQueryStringForLinks([{key: 'sua', value: 'true'}])}>所有商品</Link></li>
            <li><Link className={createSuaClass('false')} to={createQueryStringForLinks([{key: 'sua', value: 'false'}])}>可購買</Link></li>
          </ul>
        </li>
        <li>
          <h2 className="menu-title">價錢排序</h2>
          <ul>
            <li><Link className={createSortClass('desc')} to={createQueryStringForLinks([{key: 'sort', value: ''}])}>高到低</Link></li>
            <li><Link className={createSortClass('asc')} to={createQueryStringForLinks([{key: 'sort', value: 'asc'}])}>低到高</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  )
}

export default SideNavbar