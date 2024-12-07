
// function displayOrders(orders) {
//   const tableBody = document.querySelector("#ordersTable tbody");
//   tableBody.innerHTML = "";

//   orders.forEach(order => {
//     // console.log(order.customers); 
//     const row = document.createElement("tr");

//     row.innerHTML = `
//       <td>${order.order_id}</td>
//       <td>${order.order_date}</td>
//       <td>${order.status}</td>
//       <td>${order.customers}</td> 
//       <td>${order.totalMoney.toLocaleString()} VND</td>
//     `;

//     tableBody.appendChild(row);
//   });
// }



///phan trang va hien thi danh sách don hang, xóa don hang
document.addEventListener('DOMContentLoaded', function () {
  const orderList = document.getElementById('order_list').querySelector('tbody');
  const pagination = document.getElementById('pagination');
  const itemsPerPage = 10;
  let currentPage = 1;
  let orders = [];
  let currentEditOrderId=null;

  // Hàm để lấy dữ liệu từ API
  async function fetchOrders() {
    try {
      const response = await fetch('http://localhost:9090/getOrders');
      const data = await response.json();
      console.log(data); // Kiểm tra dữ liệu trả về từ API
  
      orders = data;
      displayOrders(orders); // Truyền orders vào hàm displayOrders
      setupPagination();
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }

  function displayOrders() {
    orderList.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = orders.slice(start, end);

    paginatedItems.forEach(order => {
      const row = document.createElement('tr');

      const cellId = document.createElement('td');
      cellId.textContent = order.order_id;
      row.appendChild(cellId);

      const cellOrderDate = document.createElement('td');
      cellOrderDate.textContent = order.order_date;
      row.appendChild(cellOrderDate);

      const cellStatus = document.createElement('td');
      cellStatus.textContent = order.status;
      row.appendChild(cellStatus);

      const cellCustomers = document.createElement('td');
      cellCustomers.textContent = order.customers.customer_id;
      row.appendChild(cellCustomers);

      const cellTotalMoney = document.createElement('td');
      cellTotalMoney.textContent = `${order.totalMoney} VND`;
      row.appendChild(cellTotalMoney);

      const cellActions = document.createElement('td');
      const editButton = document.createElement('button');
      editButton.textContent = 'Chỉnh sửa';
      editButton.className = 'btn btn-warning btn-sm';
      editButton.addEventListener('click', function () {
        editOrder(order.order_id);
      });
      cellActions.appendChild(editButton);
      // const viewButton = document.createElement('button');
      // viewButton.textContent = 'Xem chi tiết';
      // viewButton.classList.add('btn', 'btn-primary', 'btn-sm');
      // viewButton.addEventListener('click', function () {
      //     window.location.href = `orderdetail.html?orderId=${order.orderId}`; // Chuyển đến trang chi tiết đơn hàng
      // });
      // cellActions.appendChild(viewButton);
      row.appendChild(cellActions);

      orderList.appendChild(row);
    });
  }

  

  // Hàm để thiết lập phân trang
  function setupPagination() {
    pagination.innerHTML = '';
    const pageCount = Math.ceil(orders.length / itemsPerPage);

    for (let i = 1; i <= pageCount; i++) {
      const pageItem = document.createElement('li');
      pageItem.className = 'page-item';

      const pageLink = document.createElement('a');
      pageLink.className = 'page-link';
      pageLink.href = '#';
      pageLink.textContent = i;

      pageLink.addEventListener('click', function (event) {
        event.preventDefault();
        currentPage = i;
        displayOrders();
      });

      pageItem.appendChild(pageLink);
      pagination.appendChild(pageItem);
    }
  }

  function editOrder(orderId) {
    const order = orders.find(p => p.order_id === orderId);
    if (order) {
        currentEditOrderId = orderId;
        document.getElementById('editstatus').value = order.status;
        $('#editOrderModal').modal('show'); // Hiển thị modal
    }   
}
async function fetchAndDisplayTotalQuantity() {
  try {
    const response = await fetch('http://localhost:9090/getQuantity');
    const data = await response.json();
    const totalQuantityElement = document.getElementById('Total');
    totalQuantityElement.innerText = `${data.totalQuantity}`;
  } catch (error) {
    console.error('Error fetching the total quantity:', error);
  }
}
fetchAndDisplayTotalQuantity();
async function updateOrder(event) {
  event.preventDefault();
  const newStatus = document.getElementById('editstatus').value;
  if (newStatus && currentEditOrderId !== null) {
      try {
          const response = await fetch(`http://localhost:9090/updateOrder/${currentEditOrderId}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ status: newStatus})
          });
          if (response.ok) {
              const order = orders.find(p => p.order_id === currentEditOrderId);
              order.status= newStatus;
              displayOrders();
              cancelEdit(); // Ẩn modal sau khi cập nhật
          } else {
              console.error('Failed to update order');
          }
      } catch (error) {
          console.error('Error updating order:', error);
      }
  }
}



// Hàm để hủy chỉnh sửa
  function cancelEdit() {
    $('#editOrderModal').modal('hide'); // Ẩn modal
    currentEditOrderId = null;
  }

  // async function deleteOrder(orderId) {
  //   const confirmed = confirm('Bạn có chắc chắn muốn xóa sản phẩm này?');
  //   if (confirmed) {
  //       try {
  //           const response = await fetch(`http://localhost:9090/deleteOrder/${orderId}`, {
  //               method: 'DELETE'
  //           });
  //           if (response.ok) {
  //               orders = orders.filter(p => p.order_id !== orderId);
  //               displayOrders();
  //               location.reload();
  //               setupPagination();
  //           } else {
  //               console.error('Failed to delete order');
  //           }
  //       } catch (error) {
  //           console.error('Error deleting order:', error);
  //       }
  //   }
  // }

  // Gọi hàm để lấy dữ liệu từ API và hiển thị sản phẩm
  document.getElementById('edit-order-form').addEventListener('submit', updateOrder);
  fetchOrders();
});
//end hien thi danh sách


// ham them moi 

async function fetchNewProducts() {
  try {
  
    const response = await fetch('http://localhost:9090/getProductInMonth');
    const data = await response.json();

    const newProductElement = document.getElementById('newProduct');
    newProductElement.innerText = `${data.numberOfProducts}`;
  } catch (error) {
    console.error('Error fetching new products:', error);
  }
}
fetchNewProducts();





async function fetchRevenueData() {
  try {
      const response = await fetch('http://localhost:9090/orders/total-money-weekly');

      // Kiểm tra xem yêu cầu có thành công không
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      // Parse dữ liệu JSON từ API
      const data = await response.json();
      
      // Gọi hàm cập nhật biểu đồ với dữ liệu đã lấy
      updateChart(data); 
  } catch (error) {
      console.error('Error fetching revenue data:', error);
  }
}

// Hàm cập nhật biểu đồ với dữ liệu lấy từ API
function updateChart(data) {
  // Sắp xếp dữ liệu theo tuần
  const weeks = ["week_1", "week_2", "week_3", "week_4"];
  const revenueData = weeks.map(week => data[week]);

  // Tạo biểu đồ đường với ApexCharts
  new ApexCharts(document.querySelector("#reportsChart"), {
      series: [{
          name: 'Revenue',
          data: revenueData,  // Dữ liệu doanh thu theo tuần
      }],
      chart: {
          height: 350,
          type: 'line',  // Loại biểu đồ là đường
          toolbar: {
              show: false
          },
      },
      stroke: {
          curve: 'smooth',  // Làm cho đường mượt mà
          width: 2,
      },
      xaxis: {
          categories: ["Week 1", "Week 2", "Week 3", "Week 4"], // Các tuần trong tháng
          title: {
              text: 'Weeks'
          }
      },
      yaxis: {
          title: {
              text: 'Total Revenue ($)'
          },
      },
      fill: {
          opacity: 1
      },
      tooltip: {
          y: {
              formatter: function (val) {
                  return '$' + val.toFixed(2); // Định dạng hiển thị tiền tệ
              }
          }
      },
      markers: {
          size: 5,  // Kích thước điểm đánh dấu trên đường
          hover: {
              size: 7
          }
      }
  }).render();
}

// Gọi hàm để lấy dữ liệu khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
  fetchRevenueData();  // Lấy dữ liệu từ API khi trang được tải
});



// const urlParams = new URLSearchParams(window.location.search);
// const orderId = urlParams.get('orderId'); // Giả sử URL có dạng: orderdetail.html?orderId=1

// if (orderId) {
//     // Gọi API để lấy thông tin chi tiết đơn hàng
//     fetch(`http://localhost:9090/getorderdetail/${orderId}`)
//         .then(response => response.json())
//         .then(data => {
//             // Hiển thị thông tin đơn hàng
//             document.getElementById('order-id').textContent = data.order_id;
//             document.getElementById('order-date').textContent = data.order_date;
//             document.getElementById('order-status').textContent = data.status;
//             document.getElementById('customer-name').textContent = data.customer.name;
//             document.getElementById('customer-email').textContent = data.customer.email;

//             // Hiển thị danh sách sản phẩm
//             const productList = document.getElementById('product-list');
//             data.products.forEach(product => {
//                 const li = document.createElement('li');
//                 li.classList.add('list-group-item');
//                 li.innerHTML = `<strong>${product.productName}</strong> - Số lượng: ${product.productQuantity} - Tổng: ${product.total.toLocaleString()} VND`;
//                 productList.appendChild(li);
//             });
//         })
//         .catch(error => {
//             console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
//             alert('Không thể lấy thông tin đơn hàng. Vui lòng thử lại.');
//         });
// } else {
//     alert('Không có mã đơn hàng!');
// }