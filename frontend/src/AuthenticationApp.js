import React, { useEffect, useState } from "react";
import Checkbox from "./components/checkbox/checkbox";
import { http } from "./components/utils/http";

const AuthenticationApp = () => {
  const [users, setUsers] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);

  const getUsers = async () => {
    try {
      const res = await http.get("/admin-panel");
      setUsers(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const selectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsChecked(users.map((item) => item.id));
    if (isCheckAll) {
      setIsChecked([]);
    }
  };

  const handleCheck = (e) => {
    const { id, checked } = e.target;
    setIsChecked([...isChecked, id]);
    if (!checked) {
      setIsChecked(isChecked.filter((e) => e !== id));
    }
  };

  const deleteSelected = async () => {
    isChecked.length !== 0 &&
      http
        .post("/delete-selected", {
          arr: isChecked,
        })
        .then((res) => {
          getUsers();
          setIsChecked([]);
          setIsCheckAll(false);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const toggleStatus = async (action) => {
    isChecked.length !== 0 &&
      http
        .put(`/${action}`, {
          arr: isChecked,
        })
        .then((res) => {
          getUsers();
          setIsChecked([]);
          setIsCheckAll(false);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  console.log(isChecked);

  return (
    <div className="main-app">
      <header className="main-app__header">
        <button className="" onClick={() => toggleStatus("block-selected")}>
          Block
        </button>
        <button
          className="fa fa-unlock btn-del"
          onClick={() => toggleStatus("active-selected")}
        ></button>
        <button
          className="fa fa-trash-o btn-del"
          onClick={() => deleteSelected()}
        ></button>
        <button
          className=" btn-del"
          onClick={() => {
            window.localStorage.removeItem("token");
            window.location.reload(false);
          }}
        >
          Log Out
        </button>
      </header>
      <section className="main-app__section">
        <table className="table">
          <thead style={{ textAlign: "center" }}>
            <tr className="table-head">
              <th className="t-head">
                <Checkbox
                  type="checkbox"
                  name="selectAll"
                  id="seelctAll"
                  handleClick={selectAll}
                  isCheck={isCheckAll}
                />
              </th>
              <th className="t-head">#</th>
              <th className="t-head">Name</th>
              <th className="t-head">Email</th>
              <th className="t-head">Registered time</th>
              <th className="t-head">Last login time</th>
              <th className="t-head">Status</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {users ? (
              users.map((s, i) => (
                <tr className="table-body" key={s.id}>
                  <td className="t-body">
                    <Checkbox
                      key={s.id}
                      type="checkbox"
                      name={s.id}
                      id={s.id}
                      handleClick={handleCheck}
                      isCheck={isChecked.includes(s.id)}
                    />
                  </td>
                  <td className="t-body">{i + 1}</td>
                  <td className="t-body ">{s.name}</td>
                  <td className="t-body ">{s.email}</td>
                  <td className="t-body">{s.registered_time}</td>
                  <td className="t-body">{s.last_login_time}</td>
                  <td className="t-body">
                    {s.status === 1 ? (
                      <strong style={{ color: "green" }}>AVTIVE</strong>
                    ) : (
                      <strong style={{ color: "red" }}>BLOK</strong>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <h1>loading...</h1>
            )}
          </tbody>
        </table>
      </section>
      {/* https://codesandbox.io/s/react-select-all-checkbox-jbub2?file=/src/index.js */}
      {/* https://stackoverflow.com/questions/72454845/react-how-to-select-all-checkboxes-based-on-one-without-using-the-map-function */}
    </div>
  );
};

export default AuthenticationApp;
