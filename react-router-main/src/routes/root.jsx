import { useEffect } from "react";
import {
    Outlet,
    NavLink,
    Link,
    useLoaderData,
    Form,
    redirect,
    useNavigation,
    useSubmit,
  } from "react-router-dom";
  import { getContacts, createContact } from "../contacts";


  export async function action() {
    const contacts = await createContact();
    return redirect(`/contacts/${contacts.id}/edit`);
  }

export default function Root() {
    const { contacts, q } = useLoaderData();
    const navigation = useNavigation();
    const submit = useSubmit();
    

    const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

    useEffect(() => {
      document.getElementById("q").value = q;
    }, [q]);

    return (
      <>
        <div id="sidebar">
          <h1>React Router Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                className={searching ? "loading" : ""}
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                defaultValue={q}
                onChange={(event) => {
                  const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
                }}
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={!searching}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </Form>
        <Form method="post">
            <button type="submit">New</button>
          </Form>
          </div>
          <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contacts) => (
                <li key={contacts.id}>
                  <NavLink
                    to={`contacts/${contacts.id}`}
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }
                  >
                  <Link to={`contacts/${contacts.id}`}>
                    {contacts.first || contacts.last ? (
                      <>
                        {contacts.first} {contacts.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contacts.favorite && <span>★</span>}
                  </Link>
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
          </nav>
        </div>
        <div 
        id="detail"
          className={
            navigation.state === "loading" ? "loading" : ""
          }
        >
        <Outlet/>
        </div>
      </>
    );
  }
  export async function loader({ request }) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
    return { contacts, q };
  }