import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import styles from '../Styles/Dashboard.module.css';

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};
const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
  { name: 'Reports', href: '#', current: false },
];
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
];

const Dashboard = () => {
  return (
    <div className="min-h-full">
      <Disclosure as="nav" className={styles.navbar}>
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
             
            <div className="hidden md:flex ml-10 space-x-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={item.current ? styles.currentLink : styles.navLink}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button type="button" className={styles.notificationButton}>
              <BellIcon className="w-6 h-6" />
            </button>
            <Menu as="div" className="relative">
              <MenuButton className={styles.profileButton}>
                <img
                  alt=""
                  src={user.imageUrl}
                  className="w-8 h-8 rounded-full"
                />
              </MenuButton>
              <MenuItems className={styles.menuItems}>
                {userNavigation.map((item) => (
                  <MenuItem key={item.name}>
                    <a href={item.href} className={styles.menuItem}>
                      {item.name}
                    </a>
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </Disclosure>

      <header className={styles.header}>
        <h1>Dashboard</h1>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Content Section */}
          <div className={styles.mainContent}>
            {/* Cards, Charts, or additional components */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
