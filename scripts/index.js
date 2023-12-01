// Global Variables
const api = 'https://fakestoreapi.com/products';
const displayDiv = document.getElementById('display');
let cart = [];

document.addEventListener('DOMContentLoaded', function () {
    $('[data-toggle="collapse"]').collapse();
});

// Fake Store Function
const fakeStore = async (endpoint) => {
    try {
        const response = await fetch(`${api}/${endpoint}`);
        const data = await response.json();
        console.log(data);

        // Invoke the displayCards function with the fetched data
        displayCards(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// On Load
window.onload = () => {
    fakeStore('').catch(error => {
        console.error('Error fetching data:', error);
    });
};

const displayCards = (data) => {
    const cardContainer = document.getElementById('display');

    // Cycle through the data and create cards
    data.forEach((item, index) => {
        // Card element
        const card = document.createElement('div');
        card.classList.add('card');

        // Card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const itemImage = document.createElement('img');
        itemImage.src = item.image;
        itemImage.alt = item.title;
        itemImage.classList.add('item-image');

        const itemTitle = document.createElement('h5');
        itemTitle.classList.add('mb-0');
        itemTitle.textContent = item.title;

        // Append image and title to card body
        cardBody.appendChild(itemImage);
        cardBody.appendChild(itemTitle);

        // Accordion for item description
        const accordionItem = createAccordionItem([item]);

        // Append accordion to card body
        cardBody.appendChild(accordionItem);

        // Footer for "Add to Cart" button
        const footer = document.createElement('div');
        footer.classList.add('card-footer');

        // Item price element
        const itemPrice = document.createElement('div');
        itemPrice.classList.add('item-price');
        itemPrice.textContent = `${item.price}`;

        // Append price to footer
        footer.appendChild(itemPrice);

        // Create "Add to Cart" button
        const addToCart = document.createElement('button');
        addToCart.classList.add('btn', 'btn-primary');
        addToCart.textContent = 'Add to Cart';

        // Add event listener to the button
        addToCart.addEventListener('click', () => {
            submitToCart(item, data);
        });

        const submitToCart = (item, data) => {
        // Add the current item to the cart array
        cart.push({
            ...item,
            image: data[item.id].image
        });

    // Log the updated cart data to the console
    console.log('Item added to cart:', item);
    openCartModal();
    };

        // Append button to footer
        footer.appendChild(addToCart);

        // Append card body and footer to the card
        card.appendChild(cardBody);
        card.appendChild(footer);

        // Append the card to the container
        cardContainer.appendChild(card);
    });
};

let item = [];

function createAccordionItem(items) {
    // Create accordion container
    var accordion = document.createElement('div');
    accordion.classList.add('accordion');

    // Create accordion title
    var title = document.createElement('div');
    title.classList.add('accordion-title');
    title.innerText = 'Description';

    // Create accordion content
    var content = document.createElement('div');
    content.classList.add('accordion-content');
    content.style.display = 'none';

    // Iterate over items and append descriptions to content
    items.forEach(function(item) {
        var descriptionParagraph = document.createElement('p');
        descriptionParagraph.textContent = item.description;
        content.appendChild(descriptionParagraph);
    });

    // Append title and content to the accordion
    accordion.appendChild(title);
    accordion.appendChild(content);

    // Add click event to toggle accordion content
    title.addEventListener('click', function () {
        content.style.display = (content.style.display === 'none' || content.style.display === '') ? 'block' : 'none';
    });

    // Return the created accordion
    return accordion;
}

// Add item to cart
const submitToCart = (item) => {

    console.log("Adding to cart: ", item);
    // Check if the item is already in the cart
    const existingItem = cart.find(cartItem => cartItem.title === item.title);

    if (existingItem) {
        // If the item is already in the cart, increase the quantity and update the total price
        existingItem.quantity += 1;
        existingItem.totalPrice = existingItem.price * existingItem.quantity;
    } else {
        // If the item is not in the cart, add it with an initial quantity of 1
        cart.push({
            title: item.title,
            price: item.price,
            quantity: 1,
        });
    }

    // Log the updated cart data to the console
    console.log('Item added to cart:', item);

    // Open the cart modal after adding the item
    openCartModal();
};

// Function to display cart content in the modal
const displayCart = () => {
    // Select the cart modal body
    const cartModalBody = document.getElementById('cartModalBody');

    // Clear the existing content in the modal body
    cartModalBody.innerHTML = '';

    // Iterate through the items in the cart
    cart.forEach((item, index) => {
        // Create a container for each item in the cart
        const cartItemContainer = document.createElement('div');
        cartItemContainer.classList.add('cart-item', 'flex-column');

        // Create a row for the item's information
        const itemInfoRow = document.createElement('div');
        itemInfoRow.classList.add('row');

        // Display the current quantity
        const quantityCol = document.createElement('div');
        quantityCol.classList.add('col');
        quantityCol.textContent = `Quantity: ${item.quantity}`;

        itemInfoRow.appendChild(quantityCol);

        // Display the title
        const titleCol = document.createElement('div');
        titleCol.classList.add('col');
        titleCol.textContent = `Title: ${item.title}`;

        itemInfoRow.appendChild(titleCol);

        // Display the item's total price
        const priceCol = document.createElement('div');
        priceCol.classList.add('col');
        priceCol.textContent = `Price: $${item.price}`;

        itemInfoRow.appendChild(priceCol);

        // Create a remove button for the item
        const removeButton = document.createElement('button');
        removeButton.classList.add('btn', 'btn-danger');
        removeButton.textContent = 'Remove';

        // Remove item by updating index
        removeButton.addEventListener('click', (function (currentIndex) {
            return function () {
                removeFromCart(currentIndex);
            };
        })(index));

        // Append the row and remove button to the cart item container
        cartItemContainer.appendChild(itemInfoRow);
        cartItemContainer.appendChild(removeButton);

        // Append the cart item container to the cart modal body
        cartModalBody.appendChild(cartItemContainer);
    });

    // Create a table for the footer
    const footerTable = document.createElement('table');
    footerTable.classList.add('table', 'table-bordered');

    // Create table rows for subtotal, tax, shipping, and total cost
    const subtotalRow = document.createElement('tr');
    subtotalRow.innerHTML = `
        <td>Subtotal</td>
        <td>$${calculateSubtotal().toFixed(2)}</td>
    `;

    const taxRow = document.createElement('tr');
    taxRow.innerHTML = `
        <td>VT Tax (6%)</td>
        <td>$${calculateTax().toFixed(2)}</td>
    `;

    const shippingRow = document.createElement('tr');
    shippingRow.innerHTML = `
        <td>Shipping</td>
        <td>$5.00</td>
    `;

    const totalCostRow = document.createElement('tr');
    totalCostRow.innerHTML = `
        <td>Total Cost</td>
        <td>$${calculateTotalCost().toFixed(2)}</td>
    `;

    // Append rows to the table
    footerTable.appendChild(subtotalRow);
    footerTable.appendChild(taxRow);
    footerTable.appendChild(shippingRow);
    footerTable.appendChild(totalCostRow);

    // Select the modal footer
    const modalFooter = document.getElementById('modalFooter');

    // Clear existing content in the modal footer
    modalFooter.innerHTML = '';

    // Append the table to the modal footer
    modalFooter.appendChild(footerTable);

    // Checkout button
    const checkoutButton = document.createElement('button');
    checkoutButton.classList.add('btn', 'btn-success');
    checkoutButton.textContent = 'Checkout';

    // Add event listener to open checkout.html in a new tab
    checkoutButton.addEventListener('click', () => {
        window.open('checkout.html');
    });

    // Clear Cart button
    const clearCartButton = document.createElement('button');
    clearCartButton.classList.add('btn', 'btn-danger');
    clearCartButton.textContent = 'Clear Cart';

    // Event listener to clear the cart
    clearCartButton.addEventListener('click', () => {
        cart = []; // Clear the cart array
        displayCart(); // Refresh the cart display
    });

    // Append Checkout and Clear Cart buttons to the modal footer
    modalFooter.appendChild(checkoutButton);
    modalFooter.appendChild(clearCartButton);
};

// Calculate subtotal
const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Calculate tax
const calculateTax = () => {
    return calculateSubtotal() * 0.06;
};

// Calculate total cost (subtotal + tax + shipping)
const calculateTotalCost = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const shipping = 5; // Fixed shipping cost
    return subtotal + tax + shipping;
};



// Open the cart modal
const openCartModal = () => {
    // Select the modal element
    const modal = $('#cartModal');

    // Display the modal
    modal.modal('show');

    // Call the displayCart function to show cart data in the modal
    displayCart();
};

const removeFromCart = (index) => {
    // Remove the item at the specified index from the cart array
    cart.splice(index, 1);

    // Update the cart modal to reflect the changes
    displayCart();
};
