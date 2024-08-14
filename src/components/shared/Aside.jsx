import { NavLink } from 'react-router-dom'
import Title from 'antd/es/typography/Title'
import HomeIcon from '../icons/HomeIcon'

const Sidebar = () => {
  return (
    <>
      <div className='p-8'>
        <Title level={3} style={{ color: 'black' }}>
          Aliran Koi
        </Title>
      </div>

      <div className='flex flex-col gap-4 px-4'>
        <Menu link='/dashboard'>
          <HomeIcon /> Dashboard
        </Menu>

        <Menu link='/orders'>
          <HomeIcon /> Tugas
        </Menu>
      </div>
    </>
  )
}

const Menu = ({ link, children }) => {
  return (
    <NavLink
      to={link}
      className={({ isActive, isPending }) =>
        `flex h-12 items-center gap-4 rounded-full pl-4 font-semibold text-gray-400 ${
          isActive ? 'bg-blue-500 text-white' : 'text-gray-400'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export default Sidebar
