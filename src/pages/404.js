import React from "react";
import { Link } from "gatsby-link";

const NotFoundPage = () => (
  <div>
    <h1>404</h1>
    <p>Нет такой страницы :(</p>
    <Link to={"welcome"}>Вернуться на главную</Link>
  </div>
);

export default NotFoundPage;
