// Retrieve token from localStorage
const token = localStorage.getItem("token");

//  Wait for the DOM to be fully loaded before executing the code
document.addEventListener("DOMContentLoaded", function () {
  //  Retrieve necessary HTML elements
  const amount = document.getElementById("amount");
  const desc = document.getElementById("desc");
  const cat = document.getElementById("cat");
  const table = document.getElementById("expenseTable");
  const tbody = table.querySelector("tbody");
  const premiumButton = document.getElementById("premiumButton");


  let token = localStorage.getItem("token");
  console.log('on refresh running')
  if (localStorage.getItem("ispremiumuser")==="true") {
    showPremiumUser();
  }
  console.log('expenses')
 
  axios
    .get("http://localhost:3000/expense/getexpenses", {
      headers: { Authorization: token },
    })
    .then((res) => {
      console.log("get expenses", res.data.allExpense);
      const expense = res.data.allExpense;
      expense.forEach((obj) => {
        // Create new table row for each expense
        const newRow = document.createElement("tr");
        const expenseDetail = [obj.amount, obj.description, obj.category];
        expenseDetail.forEach(function (value) {
          const newCell = document.createElement("td");
          newCell.textContent = value;
          newRow.appendChild(newCell);
        });

        // Create delete button cell for each row
        const deleteCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        newRow.id = obj._id;

        deleteButton.addEventListener("click", function () {
          // Remove the row from the table when the delete button is clicked
          deleteFn(newRow.id);
          newRow.remove();
        });
        deleteCell.appendChild(deleteButton);
        newRow.appendChild(deleteCell);

        // Append the new row to the table body
        tbody.appendChild(newRow);
      });
    })
    .catch((err) => {
      console.log(err);
    });

  console.log("i am above logout");

  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", function (e) {
    e.preventDefault();
    // Clear the token from local storage to log the user out
    localStorage.removeItem("token");
    localStorage.removeItem("ispremiumuser");
    console.log("i am logout");
    window.location.href = "index.html";
  });

  // Add an event listener for the add expense form submission
  const addExpenseForm = document.getElementById("addExpenseForm");
  addExpenseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const expObj = {
      amount: amount.value,
      description: desc.value,
      category: cat.value,
    };
    console.log(expObj);
    axios
      .post("http://localhost:3000/expense/addexpense", expObj, {
        headers: { Authorization: token },
      })
      .then((res) => {
        // console.log(res); // Assuming the ID is in the response

        // Create new table row for the added expense
        const newRow = document.createElement("tr");
        // Create table data cells
        const expenseDetail = [amount.value, desc.value, cat.value];
        expenseDetail.forEach(function (value) {
          const newCell = document.createElement("td");
          newCell.textContent = value;
          newRow.appendChild(newCell);
        });
        // Create delete button cell for the new row
        const deleteCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        newRow.id = res.data.data._id;
        // console.log("ppppppppppppppppppppppppppp",res.data.data._id)

        deleteButton.addEventListener("click", function () {
          // Remove the row from the table when the delete button is clicked
          deleteFn(newRow.id);

          newRow.remove();
        });
        deleteCell.appendChild(deleteButton);
        newRow.appendChild(deleteCell);

        // Append the new row to the table body
        tbody.appendChild(newRow);
        // Reset the form
        addExpenseForm.reset();
      })
      .catch((err) => {
        console.log(err);
      });
  });

  //Define the delete function
  const deleteFn = function (id) {
    // console.log(id);

    axios
      .post(
        "http://localhost:3000/expense/deleteexpense",
        { id: id },
        { headers: { Authorization: token } }
      )
      .then(() => {
        console.log("deleted");
      })

      .catch((err) => {
        console.log(err);
      });
  };
});

// Add an event listener for the premium button click
premiumButton.addEventListener("click", async function (e) {
  e.preventDefault();

  // Retrieve the token again for the premium button click event
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    { headers: { Authorization: token } }
  );

  // Following is the code executed after I get a response from the buypremium membership controller.
  console.log(response);
  var options = {
    key: response.data.key_id, // We give the key id so that Razorpay could know that it is a payment request referring to my company.
    order_id: response.data.order.id, // This order id tells Razorpay about time amount and currency. This is already registered at Razorpay.
    // Following handler will handle the success payment. It is a callback function and it is called after the success of payment. This callback is executed by Razorpay itself.
    handler: async function (response) {
      await axios.post(
        "http://localhost:3000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
          payStatus: true,
        },
        { headers: { Authorization: token } }
      );
      alert("Congratulations! You Are Now a Premium User");
      localStorage.setItem('ispremiumuser',true)
      //  premiumButton.remove(); // Removing the premium button once the user is a premium user.
      // Adding 'You are a premium user'.
      showPremiumUser();
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open(); // This opens the UI of Razorpay over our page.
  e.preventDefault();

  // Below code is to handle payment failure case. Again, this will be executed by Razorpay itself.
  rzp1.on("payment.failed", async function (response) {
    console.log(response.error.metadata);
    alert("Payment Failed Please try Again");
    // Changing the payment status to "FAILED" in the order table
    await axios.post(
      "http://localhost:3000/purchase/updatetransactionstatus",
      {
        order_id: response.error.metadata.order_id,
        payment_id: response.error.metadata.payment_id,
        payStatus: false,
      },
      { headers: { Authorization: token } }
    );
  });
});
// Define the showPremiumUser function
// Inside your showPremiumUser function
function showPremiumUser() {
  const premiumButton = document.getElementById("premiumButton");
  premiumButton.style.visibility = "hidden";

  const premiumUserDiv = document.getElementById("premiumuser");
  premiumUserDiv.style.textAlign = "flex";
  const premiumUserButton = document.createElement("button");
  premiumUserButton.textContent = "You are now a Premium User";
  premiumUserButton.className = "premium-user-button";
  premiumUserDiv.appendChild(premiumUserButton);

  const downloadButton = document.getElementById("downloadBtn");
  downloadButton.style.display = "block";

  const leaderboardBtn = document.getElementById("leaderboardbtn");
  leaderboardBtn.textContent = "🏆 Show Leaderboard 🏆";
  leaderboardBtn.style.display = "inline-block";
  leaderboardBtn.style.position = "fixed";
  leaderboardBtn.style.right = "10px";
  leaderboardBtn.style.top = "10px";

  const leaderboardContainer = document.createElement("div");
  leaderboardContainer.className = "leaderboard-container";
  leaderboardBtn.onclick = async () => {
    try {
      const token = localStorage.getItem("token");
      const leaderboardArray = await axios.get(
        "http://localhost:3000/premium/showLeaderboard",
        {
          headers: { Authorization: token },
        }
      );

      console.log(
        "leaderboardArray >>>>>>>>>>>>>>>>>>>>>>",
        leaderboardArray.data
      );
      displayLeaderboard(leaderboardArray.data);
    } catch (err) {
      console.log("Error fetching Leaderboard", err);
    }
  };
}

const closeLeaderboard = document.getElementById("closeLeaderboard");
closeLeaderboard.addEventListener("click", () => {
  hideLeaderboardModal();
});

function displayLeaderboard(leaderboardData) {
  const leaderboardModal = document.getElementById("leaderboardModal");
  leaderboardModal.style.display = "block";
  const leaderboardList = document.getElementById("leaderboardList");
  leaderboardList.innerHTML = "";

  leaderboardData.forEach((entry) => {
    const listItem = document.createElement("li");
    const totalExpenses = entry.total ?? 0;
    listItem.textContent = `Name: ${
      entry.name
    }, Total Expenses: ${totalExpenses}`;
    leaderboardList.appendChild(listItem);
  });
}

function hideLeaderboardModal() {
  const leaderboardModal = document.getElementById("leaderboardModal");
  leaderboardModal.style.display = "none";
}

document
  .getElementById("downloadBtn")
  .addEventListener("click", function download() {
    axios
      .get("http://localhost:3000/expense/download", {
        headers: { Authorization: token },
      })
      .then((response) => {
        console.log("RESPONSE", response);
        if (response.status === 200) {
          //backend is sending a download link which on click opens new tab in browser and file starts downloading
          const a = document.createElement("a");
          a.href = response.data.fileUrl;
          a.download = `${response.data.filename}`; //this will instruct browser to download the file named myexpense.csv
          a.click();
        } else {
          console.log("Error downloading expense file, no response");
        }
      });
  });



function loadingWork(){
  

    let token = localStorage.getItem("token");
    if (localStorage.getItem("ispremiumuser")==true) {
      showPremiumUser();
    }
    console.log('expenses')
   
    axios
      .get("http://localhost:3000/expense/getexpenses", {
        headers: { Authorization: token },
      })
      .then((res) => {
        console.log("get expenses", res.data.allExpense);
        const expense = res.data.allExpense;
        expense.forEach((obj) => {
          // Create new table row for each expense
          const newRow = document.createElement("tr");
          const expenseDetail = [obj.amount, obj.description, obj.category];
          expenseDetail.forEach(function (value) {
            const newCell = document.createElement("td");
            newCell.textContent = value;
            newRow.appendChild(newCell);
          });

          // Create delete button cell for each row
          const deleteCell = document.createElement("td");
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.classList.add("delete-button");
          newRow.id = obj._id;

          deleteButton.addEventListener("click", function () {
            // Remove the row from the table when the delete button is clicked
            deleteFn(newRow.id);
            newRow.remove();
          });
          deleteCell.appendChild(deleteButton);
          newRow.appendChild(deleteCell);

          // Append the new row to the table body
          tbody.appendChild(newRow);
        });
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("i am above logout");

    const logoutButton = document.getElementById("logoutButton");
    logoutButton.addEventListener("click", function (e) {
      e.preventDefault();
      // Clear the token from local storage to log the user out
      localStorage.removeItem("token");
      localStorage.removeItem("ispremiumuser");
      console.log("i am logout");
      window.location.href = "index.html";
    });
  
}
