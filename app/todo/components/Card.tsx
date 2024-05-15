import React from "react";

interface CardProps {
  label: string;
  list: string[];
  handleDelete: (food: string, type: string) => void;
  foodCountdowns: Record<string, number>;
}

export default function Card({
  label,
  list,
  handleDelete,
  foodCountdowns,
}: CardProps) {
  return (
    <div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <p className="card-title text-secondary flex justify-center">
            {label}
          </p>
          <ul className="grid gap-2">
            {list.map((item, index) => (
              <button
                key={index}
                className="btn btn-success text-success-content"
                onClick={() => handleDelete(item, label)}
              >
                <li className="flex justify-between gap-2">
                  {item}{" "}
                  <span className="text-error">
                    {foodCountdowns[item] && `(${foodCountdowns[item]})`}
                  </span>
                </li>
              </button>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
