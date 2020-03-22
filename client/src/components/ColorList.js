import React, { useState, useEffect } from "react";
import axios from "axios";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors}) => {


  // console.log(match);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [newColor, setNewColor] = useState({
    color: "",
    code: { hex: "" }
  })

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);

    
  };



  const refresh = () => {
    axiosWithAuth()
      .get("colors")
      .then(res => {
        updateColors(res.data);
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  };
  const saveEdit = e => {
    e.preventDefault();
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is it saved right now?
    // console.log(colorToEdit)
    axiosWithAuth().put(`/colors/${colorToEdit.id}`, colorToEdit)
    .then(() => {
      const newColors = colors.map(x => {
        if (x.id == colorToEdit.id) {
          return colorToEdit;
        } else {
          return x;
        }
      });
      updateColors(newColors);
      setEditing(false);
      setColorToEdit({ initialColor });
    })
    .catch(err => {
      console.log("Error: ", err);
    });

    
  };
  const deleteColor = color => {
    // make a delete request to delete this color
    axiosWithAuth()
    .delete(`colors/${color.id}`)
    .then(res => {
      setColorToEdit(initialColor);
      setEditing(false);
      refresh();
    })
    .catch(err => {
      console.log("Error: ", err);
    });
};

// Add color stretch

const handleChange =  e => {
  setNewColor({...newColor, color : e.target.value});
};

const addColor = () => {
  axiosWithAuth()
  .post('/colors', newColor)
  .then(res => {
      refresh()
  })
  .catch(err => {

  })
}

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={e => {
                    e.stopPropagation();
                    deleteColor(color)
                  }
                }>
                  x
              </span>{" "}
              {color.color}         
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      {/* <div className="spacer" /> */}
      {/* stretch - build another form here to add a color */}
      <form onSubmit={addColor}>
      <legend>Add Color</legend>
          <label>
            color name:
            <input
              onChange={handleChange} value={newColor.color}
            />
          </label>
          <label>
            color hex
            <input
              onChange={(e => { setNewColor({...newColor, code: {hex: e.target.value}})})} value={newColor.code.hex}
            />
          </label>
          <button type="submit">save color</button>
      </form>
      {console.log(newColor)}
    </div>
  );
};

export default ColorList;
