import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from 'react-router-dom';

function SkepsiNavbarItem(){

  return(
    <Link to="/">
      <Menu.Item>
        <h2>Skepsi</h2>
      </Menu.Item>
    </Link>
  )
}

export default SkepsiNavbarItem;
