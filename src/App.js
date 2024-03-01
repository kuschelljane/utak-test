// import './App.css';
import './firebaseConfig';
import { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, get, remove, update} from 'firebase/database';
import Progressprops from './Progressprops';

function App() {  
  const [selectedSteps, setSelectedSteps] = useState(['']);
  const progressLabels = [
    "Select a category",
    "Enter the menu name",
    "Select the options available",
    "Enter the base price", 
    "Enter the cost price", 
    "Enter the number of stocks"
  ];

  const [selectedCategory, setSelectedCategory] = useState('');
  const [menuName, setMenuName] = useState('');
  const [checkedItems, setCheckedItems] = useState({
    small: false,
    medium: false,
    large: false,
    noOptions: false,
  });
  const [basePrice, setBasePrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stocksNum, setStocksNum] = useState('');

  const handleButtonClick = (buttonCategory) => {
    setSelectedCategory(buttonCategory);
    setSelectedSteps([0]);
  };

  const handleMenuChange = (e) => {
    setMenuName(e.target.value); 
    setSelectedSteps([0, 1]);
  }

  const handleCheckboxChange = (item) => {
    if (item === 'noOptions') {
      setCheckedItems({
        small: false,
        medium: false,
        large: false,
        noOptions: !checkedItems.noOptions,
      });
    } else {
      setCheckedItems((prevCheckedItems) => ({
        ...prevCheckedItems,
        [item]: !prevCheckedItems[item],
        noOptions: false,
      }));
      setSelectedSteps([0, 1, 2]);
    }
  };

  const handleBaseChange = (e) => {
    const input = e.target.value;
    if (/^\d*\.?\d*$/.test(input) || input === '') {
      setBasePrice(input); 
      setSelectedSteps([0, 1, 2, 3]);
    }
    else {
      setBasePrice(''); 
      alert('Please input a valid number.')
    }
  }

  const handleCostChange = (e) => {
    const input = e.target.value;
    if (/^\d*\.?\d*$/.test(input) || input === '') {
      setCostPrice(input); 
      setSelectedSteps([0, 1, 2, 3, 4]);
    }
    else {
      setCostPrice(''); 
      alert('Please input a valid number.')
    }
  }

  const handleStocksChange = (e) => {
    const input = e.target.value;
    if (/^\d*\.?\d*$/.test(input) || input === '') {
      setStocksNum(input); 
      setSelectedSteps([0, 1, 2, 3 , 4 ,5]);
    }
    else {
      setStocksNum(''); 
      alert('Please input a valid number.')
    }
    setStocksNum(e.target.value); 
  }

  const selectedOptions = Object.keys(checkedItems).filter(option => checkedItems[option]);
  const db = getDatabase();
  const menuRef = ref(db, 'menus');
  const menuData = {
    foodCategory: selectedCategory,
    menuName: menuName,
    sizesOptions: selectedOptions,
    basePrice: basePrice,
    costPrice: costPrice,
    stocksNum: stocksNum,
  };

  const isDisabled = !selectedCategory || !menuName || !selectedOptions || !basePrice || !costPrice || !stocksNum;
  const handleSubmitClick = async () => {
    const menuRef = ref(db, 'menus');

    try {
      const newMenuRef = push(menuRef);
      await set(newMenuRef, menuData); 
      alert("Menu is successfully added to the database. Click 'OK' to continue.");
      window.location.reload(); 
    } catch (error) {
      console.error("Error:", error);
      alert("Error writing data to database. Please try again later.");
    }
};

const [data, setData] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    const db = getDatabase();
    const menuRef = ref(db, 'menus');

    try {
      const snapshot = await get(menuRef);

      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []); 

const [editingKey, setEditingKey] = useState(null);
const handleEditClick = (key, menu) => {
  setEditingKey(key);
  setSelectedCategory(menu.foodCategory || ''); 
  setMenuName(menu.menuName || ''); 
  setBasePrice(menu.basePrice || ''); 
  setCostPrice(menu.costPrice || '');
  setStocksNum(menu.stocksNum || '');
  const sizesOptions = menu.sizesOptions || [];
  setCheckedItems({
    small: sizesOptions.includes('small'),
    medium: sizesOptions.includes('medium'),
    large: sizesOptions.includes('large'),
    noOptions: sizesOptions.includes('noOptions'),
  });
  setSelectedSteps([0, 1, 2, 3 , 4 ,5]);
};

const updateMenu = (key, updatedData) => {
  const db = getDatabase();
  const menuRef = ref(db, 'menus/' + key);

  try {
    update(menuRef, updatedData);
    alert("The menu has been updated. Click 'OK' to continue."); 
    window.location.reload(); 
  } catch (error) {
    alert("Error updating data to database. Please try again later.");
    console.error('Error updating menu:', error);
  }
};

const handleUpdateClick = () => {
  if (editingKey) {
    const updatedData = {
      foodCategory: selectedCategory, 
      menuName: menuName,
      sizesOptions: selectedOptions, 
      basePrice: basePrice, 
      costPrice: costPrice, 
      stocksNum: stocksNum, 
    };

    updateMenu(editingKey, updatedData);
  }
};

const handleDeleteClick = (key) => {
  const db = getDatabase();
  const menuRef = ref(db, 'menus/' + key);

  try {
    remove(menuRef);
    alert("The menu has been deleted. Click 'OK' to continue."); 
    window.location.reload(); 
  } catch (error) {
    alert("Error deleting data to database. Please try again later.");
    console.error('Error deleting data:', error);
  }
};

  return (
    <div className="App">
     <div className='w-4/5 m-auto flex flex-row gap-x-10 p-10 text-center'>

      <div className='w-3/5 flex flex-col'>
      {progressLabels.map((label, index) => (
        <Progressprops key={index} label={label} isSelected={selectedSteps.includes(index)} />
      ))}
      <div className='mt-10 text-left ml-3'>
        <p className='text-blue-900'>Listed Menus</p>
        <ul>
        {data &&
          Object.entries(data).map(([key, menu]) => (
            <li key={key} className="flex items-center justify-between mb-2">
              <span className="mr-2">{`${menu.menuName}`}</span>
              <div className='my-2'>
                <button
                  className="bg-blue-700 text-white rounded p-1 w-20 text-sm"
                  onClick={() => handleEditClick(key, menu)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-700 text-white rounded p-1 w-20 text-sm ml-2"
                  onClick={() => handleDeleteClick(key)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
      </div>
      </div>

      <div className='w-full flex flex-col gap-y-2'>
        <p className='font-bold'>
          Select a category
        </p>
        <div className='w-full flex flex-col'>
        <button 
        onClick={() => handleButtonClick('Snacks')}
        className={`border-2 border-blue-100 rounded hover:bg-blue-100 flex flex-col items-center justify-center m-2 p-2 ${
          selectedCategory === 'Snacks' ? 'bg-blue-100' : ''
        }`}>
          <p className='font-bold'>Snacks</p>
          <p className='text-sm italic text-gray-400'>Indulge in delightful bites for satisfying cravings.</p>
        </button>
        <button 
        onClick={() => handleButtonClick('Dessert')}
        className={`border-2 border-blue-100 rounded hover:bg-blue-100 flex flex-col items-center justify-center m-2 p-2 ${
          selectedCategory === 'Dessert' ? 'bg-blue-100' : ''
        }`}>
          <p className='font-bold'>Dessert</p>
          <p className='text-sm italic text-gray-400'>Decadent delights, sweetening moments, pure dessert bliss.</p>
        </button>
        <button 
        onClick={() => handleButtonClick('Beverages')}
        className={`border-2 border-blue-100 rounded hover:bg-blue-100 flex flex-col items-center justify-center m-2 p-2 ${
          selectedCategory === 'Beverages' ? 'bg-blue-100' : ''
        }`}>
          <p className='font-bold'>Beverages</p>
          <p className='text-sm italic text-gray-400'>Sip, savor, and indulge in refreshing beverage experiences.</p>
        </button>
        </div>

      <div className='w-full ml-3 flex flex-col gap-y-2 p-10'>
        <p className='font-bold'>
          Enter the menu name
        </p>
        <div className='w-full flex items-center justify-center'>
          <input type = "text" 
          placeholder='Classic Menu' 
          className='border-b border-blue-100 outline-none w-full text-center'
          value={menuName}
          onChange={handleMenuChange}>
          </input>
        </div>
      </div>

      <div className='w-full ml-3 flex flex-col gap-y-2 p-10'>
        <p className='font-bold'>
          Select the options available 
        </p>
        <div className='w-full flex flex-row items-center justify-center mt-5'>
          <input type = "checkbox" 
          className='form-checkbox h-5 w-5 text-blue-600'
          checked={checkedItems.small}
          onChange={() => handleCheckboxChange('small')}></input>
          <p className='ml-2 mr-5'>Small</p>
          <input type = "checkbox" 
          className='form-checkbox h-5 w-5 text-blue-600'
          checked={checkedItems.medium}
          onChange={() => handleCheckboxChange('medium')}></input>
          <p className='ml-2 mr-5'>Medium</p>
          <input type = "checkbox" 
          className='form-checkbox h-5 w-5 text-blue-600'
          checked={checkedItems.large}
          onChange={() => handleCheckboxChange('large')}></input>
          <p className='ml-2 mr-5'>Large</p>
          <input type = "checkbox" c
          className='form-checkbox h-5 w-5 text-blue-600'
          checked={checkedItems.noOptions}
          onChange={() => handleCheckboxChange('noOptions')}></input>
          <p className='ml-2 mr-5'>No options</p>
        </div>
      </div>

      <div className='w-full ml-3 flex flex-col gap-y-2 p-10'>
        <p className='font-bold'>
          Enter the base price
        </p>
        <div className='w-full flex items-center justify-center'>
          <input type = "text" 
          placeholder='PHP' 
          className='border-b border-blue-100 outline-none w-full text-center'
          value = {basePrice}
          onChange={handleBaseChange}>
          </input>
        </div>
      </div>

      <div className='w-full ml-3 flex flex-col gap-y-2 p-10'>
        <p className='font-bold'>
          Enter the cost price
        </p>
        <div className='w-full flex items-center justify-center'>
          <input type = "text" 
          placeholder='PHP' 
          className='border-b border-blue-100 outline-none w-full text-center'
          value={costPrice}
          onChange={handleCostChange}>
          </input>
        </div>
      </div>

      <div className='w-full ml-3 flex flex-col gap-y-2 p-10'>
        <p className='font-bold'>
          Enter the number of stocks
        </p>
        <div className='w-full flex items-center justify-center'>
          <input type = "text" 
          placeholder='0' 
          className='border-b border-blue-100 outline-none w-full text-center'
          value={stocksNum}
          onChange={handleStocksChange}>
          </input>
        </div>
      </div>

      </div>
     </div>
     <div className="fixed bottom-0 w-full bg-gray-200 p-4 flex justify-center items-center">
        {!editingKey ? (<button 
        className='w-1/5 p-2 rounded bg-blue-900 font-bold text-white text-sm cursor-pointer'
        onClick={() => handleSubmitClick()}
        disabled={isDisabled}
        style={{ opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}>
          Submit
        </button>) : (<button 
        className='w-1/5 p-2 rounded bg-blue-900 font-bold text-white text-sm cursor-pointer'
        onClick={() => handleUpdateClick()}
        disabled={isDisabled}
        style={{ opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}>
          Update
        </button>) }
      </div>
    </div>
  );
}

export default App;
