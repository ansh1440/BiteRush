import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getFoodList, updateFood } from '../../services/foodService';

const UpdateFood = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [currentFood, setCurrentFood] = useState(null);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad"
    });

    useEffect(() => {
        const loadFood = async () => {
            try {
                const foods = await getFoodList();
                const food = foods.find(f => f.id.toString() === id);
                if (food) {
                    setCurrentFood(food);
                    setData({
                        name: food.name,
                        description: food.description,
                        price: food.price,
                        category: food.category
                    });
                }
            } catch (error) {
                toast.error("Error loading food data");
            }
        };
        loadFood();
    }, [id]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            await updateFood(id, data, image);
            toast.success("Food updated successfully");
            navigate('/list');
        } catch (error) {
            toast.error("Error updating food");
        }
    }

    return (
        <div className="mx-2 mt-2">
            <div className="row">
                <div className="card col-md-4">
                    <div className="card-body">
                        <h2 className="mb-4">Update Food</h2>
                        <form onSubmit={onSubmitHandler}>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">Food Image (Click to change)</label>
                                <div className="text-center">
                                    <label htmlFor="image" style={{cursor: 'pointer'}}>
                                        <img 
                                            src={
                                                image ? URL.createObjectURL(image) : 
                                                currentFood?.imageUrl ? `http://localhost:8080${currentFood.imageUrl}` : 
                                                "/upload_area.png"
                                            } 
                                            alt="Food" 
                                            width={98}
                                            style={{borderRadius: '8px', border: '2px dashed #ccc', padding: '10px'}}
                                        />
                                    </label>
                                </div>
                                <input onChange={(e) => setImage(e.target.files[0])} type="file" className="form-control" id="image" accept="image/*" hidden />
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Food name' className="form-control" required />
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea onChange={onChangeHandler} value={data.description} name="description" rows="5" placeholder='Write description here...' className="form-control" required></textarea>
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="category" className="form-label">Category</label>
                                <select onChange={onChangeHandler} value={data.category} name="category" className="form-control">
                                    <option value="Biryani">Biryani</option>
                                    <option value="Cake">Cake</option>
                                    <option value="Burger">Burger</option>
                                    <option value="Pizza">Pizza</option>
                                    <option value="Rolls">Rolls</option>
                                    <option value="Salad">Salad</option>
                                    <option value="Ice cream">Ice cream</option>
                                </select>
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="price" className="form-label">Price</label>
                                <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='₹200' className="form-control" required />
                            </div>
                            
                            <button type='submit' className='btn btn-success'>UPDATE FOOD</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateFood;