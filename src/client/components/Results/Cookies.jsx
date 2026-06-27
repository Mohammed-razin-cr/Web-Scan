import { Card } from 'client/components/Form/Card';
import Row, { ExpandableRow } from 'client/components/Form/Row';


export const parseHeaderCookies = (cookiesHeader) => {
  if (!cookiesHeader || !cookiesHeader.length) return [];
  const cookies = cookiesHeader.flatMap((cookieHeader) => {
    return cookieHeader.split(/,(?=\s[A-Za-z0-9]+=)/).map((cookieString) => {
      const [nameValuePair, ...attributePairs] = cookieString
        .split('; ')
        .map((part) => part.trim());
      const [name, value] = nameValuePair.split('=');
      const attributes = {};
      attributePairs.forEach((pair) => {
        const [attributeName, attributeValue = ''] = pair.split('=');
        attributes[attributeName] = attributeValue;
      });
      return { name, value, attributes };
    });
  });
  return cookies;
};

const CookiesCard = (props) => {
  const headerCookies = parseHeaderCookies(props.data.headerCookies) || [];
  const clientCookies = props.data.clientCookies || [];
  const noCookies = !headerCookies.length && !clientCookies.length;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {noCookies && <Row lbl="Cookies" val="None" />}
      {headerCookies.map((cookie, index) => {
        const attributes = Object.keys(cookie.attributes).map((key) => {
          return { lbl: key, val: cookie.attributes[key] };
        });
        return (
          <ExpandableRow
            key={`header-cookie-${index}-${cookie.name}`}
            lbl={cookie.name}
            val={cookie.value}
            rowList={attributes}
          />
        );
      })}
      {clientCookies.map((cookie, index) => {
        const nameValPairs = Object.keys(cookie).map((key) => {
          return { lbl: key, val: cookie[key] };
        });
        return (
          <ExpandableRow
            key={`client-cookie-${index}-${cookie.name}`}
            lbl={cookie.name}
            val=""
            rowList={nameValPairs}
          />
        );
      })}
    </Card>
  );
};

export default CookiesCard;
