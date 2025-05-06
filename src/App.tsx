import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({ id: 0, name: '', email: '', phone: 0 });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  interface User {
    id: number;
    name: string;
    email: string;
    phone: number;
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
      toast.success('Users fetched successfully!');
    } catch (error) {
      toast.error('Failed to fetch users.');
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post<User>('https://jsonplaceholder.typicode.com/users', newUser);
      setUsers([...users, response.data]);
      setNewUser({ id: 0, name: '', email: '', phone: 0 });
      toast.success('User created successfully!');
    } catch (error) {
      toast.error('Failed to create user.');
    }
  };

  const handleUpdate = async () => {
    if (editingUser) {
      try {
        const response = await axios.put<User>(
          `https://jsonplaceholder.typicode.com/users/${editingUser.id}`,
          editingUser
        );
        setUsers(users.map((user) => (user.id === editingUser.id ? response.data : user)));
        setEditingUser(null);
        toast.success('User updated successfully!');
      } catch (error) {
        toast.error('Failed to update user.');
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      toast.success('User deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete user.');
    }
  };


  return (
    <>
       <div className="container">
      <h1 className="text-center mb-4">User Management</h1>

      {/* Create User */}
      <div className="mb-4">
        <h2>Create User</h2>
        <div className="row g-2">
          <div className="col-md-2">
            <input
              type="text"
              placeholder="Name"
              className="form-control"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <input
              type="email"
              placeholder="Email"
              className="form-control"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              placeholder="Phone"
              className="form-control"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: Number(e.target.value) })}
            />
          </div>
        </div>
        <button onClick={handleCreate} className="btn btn-primary w-10 mt-3">Add User</button>
      </div>

      {/* Update User */}
      {editingUser && (
        <div className="mb-4">
          <h2>Edit User</h2>
          <div className="row g-2">
            <div className="col-md-2">
              <input
                type="text"
                placeholder="Name"
                className="form-control"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <input
                type="email"
                placeholder="Email"
                className="form-control"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                placeholder="Phone"
                className="form-control"
                value={editingUser.phone}
                onChange={(e) => setEditingUser({ ...editingUser, phone: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="d-flex justify-content- mt-3">
            <button onClick={handleUpdate} className="btn btn-warning w-10 me-2">Update User</button>
            <button onClick={() => setEditingUser(null)} className="btn btn-info w-10">Cancel</button>
          </div>
        </div>
      )}

      {/* User Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <button onClick={() => setEditingUser(user)} className="btn btn-sm btn-primary me-2">Edit</button>
                  <button onClick={() => handleDelete(user.id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
      <ToastContainer />
    </>
  );
}

export default App;