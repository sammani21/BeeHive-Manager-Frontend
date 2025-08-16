import React from 'react';

interface ProductsComparisonChartProps {
  years: string[];
  honeyData: number[];
  waxData: number[];
}

const ProductsComparisonChart: React.FC<ProductsComparisonChartProps> = ({
  years,
  honeyData,
  waxData,
}) => {
  return (
    <div style={{ height: '300px' }}>
      ```chartjs
      {
        "type": "bar",
        "data": {
          "labels": years,
          "datasets": [
            {
              "label": "Honey Quantity",
              "data": honeyData,
              "backgroundColor": "rgba(255, 99, 132, 0.6)",
              "borderColor": "rgba(255, 99, 132, 1)",
              "borderWidth": 1
            },
            {
              "label": "Wax Quantity",
              "data": waxData,
              "backgroundColor": "rgba(54, 162, 235, 0.6)",
              "borderColor": "rgba(54, 162, 235, 1)",
              "borderWidth": 1
            }
          ]
        },
        "options": {
          "responsive": true,
          "maintainAspectRatio": false,
          "plugins": {
            "legend": {
              "position": "top"
            },
            "tooltip": {
              "callbacks": {
                "label": function(tooltipItem) {
                  return tooltipItem.dataset.label + ": " + tooltipItem.raw;
                }
              }
            }
          },
          "scales": {
            "x": {
              "stacked": false
            },
            "y": {
              "stacked": false,
              "beginAtZero": true
            }
          },
          "layout": {
            "padding": {
              "left": 0,
              "right": 0,
              "top": 0,
              "bottom": 0
            }
          }
        }
      }
      ```
    </div>
  );
};

export default ProductsComparisonChart;