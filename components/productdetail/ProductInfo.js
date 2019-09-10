import React from 'react';
import css from './ProductTable.module.scss';
export default function ProductInfo({
  deals = [
    {
      productStatus: '',
      productNumber: '',
      productOriginType: '',
      filters: [{ label: '', value: '' }],
    },
  ],
}) {
  return (
    <>
      <table className={css.wrap}>
        <tbody>
          <tr>
            <th>상품상태</th>
            <td>{deals.productStatusName}</td>
          </tr>
          <tr>
            <th>상품번호</th>
            <td>{deals.dealId}</td>
          </tr>
          <tr>
            <th>원산지</th>
            <td>{deals.originAreaName}</td>
          </tr>
        </tbody>
      </table>
      <table className={css.wrap}>
        <tbody>
          {deals.filters.length > 0
            ? deals.filters.map((filter, index) => {
                return (
                  <tr key={index}>
                    <th>{filter.label}</th>
                    <td>{filter.value}</td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    </>
  );
}
