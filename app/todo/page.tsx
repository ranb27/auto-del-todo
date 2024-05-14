"use client";

import React, { useState, useEffect, use } from "react";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";

//TODO: Components
import Card from "./components/Card";

function page() {
  //! Supabase Client
  const supabase = createClient();

  //! Interface
  interface Food {
    id: number;
    food_name: string;
    food_type: string;
    foodCountdowns: number;
  }

  //! State
  const [foodList, setFoodList] = useState<Food[]>([]);
  const [fruitList, setFruitList] = useState<string[]>([]);
  const [vegetableList, setVegetableList] = useState<string[]>([]);

  // Countdowns for each food item
  const [foodCountdowns, setFoodCountdowns] = useState<Record<string, number>>(
    {}
  );

  // loading
  const [loading, setLoading] = useState<boolean>(false);

  //! Fetch Data from API supabase Schema public Table food_master
  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      try {
        const { data: allFood, error } = await supabase
          .from("food_master")
          .select("*");
        if (error) {
          throw new Error(error.message);
        }

        // Filter out items that are already in fruitList or vegetableList
        const filteredFood = allFood.filter(
          (item) =>
            !fruitList.includes(item.food_name) &&
            !vegetableList.includes(item.food_name)
        );

        await setFoodList(filteredFood);
        await setLoading(false);
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
      }
    };

    fetchFood();
  }, [fruitList, vegetableList]);

  //* handle apending add to fruitList if food_type is fruit else to vegetableList
  const handleAdd = (food: Food) => {
    const countdownTime = 5; // 5 seconds
    setFoodCountdowns((prevCountdowns) => ({
      ...prevCountdowns,
      [food.food_name]: countdownTime,
    }));

    if (food.food_type === "Fruit") {
      setFruitList((prevList) => [...prevList, food.food_name]);
    } else if (food.food_type === "Vegetable") {
      setVegetableList((prevList) => [...prevList, food.food_name]);
    } else {
      console.error("Invalid food type");
    }
  };

  //* handle slice delete from fruitList & vegetableList and append to foodList
  const handleDelete = (food: string, type: string) => {
    if (type === "Fruit") {
      const newFruitList = fruitList.filter((item) => item !== food);
      setFruitList(newFruitList);
    } else {
      const newVegetableList = vegetableList.filter((item) => item !== food);
      setVegetableList(newVegetableList);
    }
  };

  //* countdown timer for auto return with 5s
  // return food to foodList
  const handleReturn = (foodName: string) => {
    setFruitList((prevList) => prevList.filter((item) => item !== foodName));
    setVegetableList((prevList) =>
      prevList.filter((item) => item !== foodName)
    );

    const food = foodList.find((item) => item.food_name === foodName);
    if (food) {
      setFoodList((prevList) => [...prevList, food]);
    }
  };

  // effect to countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setFoodCountdowns((prevCountdowns) => {
        const newCountdowns = { ...prevCountdowns };

        Object.keys(newCountdowns).forEach((foodName) => {
          newCountdowns[foodName] -= 1;
          if (newCountdowns[foodName] <= 0) {
            handleReturn(foodName);
            delete newCountdowns[foodName];
          }
        });

        return newCountdowns;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex justify-center items-center">
      {loading ? (
        <span className="loading loading-spinner text-primary w-32"></span>
      ) : (
        <div className="grid grid-cols-1">
          <div className="grid lg:grid-cols-7 sm:grid-cols-3 grid-cols-1 gap-4">
            <div className="grid col-span-1 gap-4 my-auto mx-auto">
              {foodList.map((food: Food) => (
                <div className="grid grid-cols-1" key={food.id}>
                  <button
                    onClick={() => handleAdd(food)}
                    className="btn btn-primary"
                  >
                    {food.food_name}
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-3">
              <Card
                label="Fruit"
                list={fruitList}
                handleDelete={handleDelete}
                foodCountdowns={foodCountdowns}
              />
            </div>
            <div className="lg:col-span-3">
              <Card
                label="Vegetable"
                list={vegetableList}
                handleDelete={handleDelete}
                foodCountdowns={foodCountdowns}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
