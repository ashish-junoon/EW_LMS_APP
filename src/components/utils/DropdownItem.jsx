import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function DropdownItem({ href, onClick, className, children, icon, description }) {
    return (
        <MenuItem>
            {({ active }) => (
                href ? (
                    <a
                        href={href}
                        className={classNames(
                            active ? 'bg-light text-black' : 'text-black',
                            'px-4 py-2 text-sm flex items-center',
                            className
                        )}
                    >
                        {icon && <span className="mr-2">{icon}</span>}
                        <div className="flex flex-col">
                            <span>{children}</span>
                            {description && <span className="text-xs text-gray-500">{description}</span>}
                        </div>
                    </a>
                ) : (
                    <button
                        onClick={onClick}
                        className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'w-full px-4 py-2 text-left text-sm flex items-center',
                            className
                        )}
                    >
                        {icon && <span className="mr-2">{icon}</span>}
                        <div className="flex flex-col">
                            <span>{children}</span>
                            {description && <span className="text-xs text-dark">{description}</span>}
                        </div>
                    </button>
                )
            )}
        </MenuItem>
    );
}

function Dropdown({ children, items, size, heading }) {
    return (
        <Menu as="div" className="relative inline-block text-left ml-4">
            <MenuButton className="flex w-full justify-center gap-x-1 text-sm font-semibold text-black">
                {children}
                {/* <ChevronDownIcon className="-mr-1 h-5 w-5" aria-hidden="true" /> */}
            </MenuButton>

            <MenuItems
                className={`absolute right-0 z-10 mt-5 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${size}`}
            >
                <div className="py-0">
                    {heading && (
                        <div className="px-4 py-2 text-sm text-white font-semibold bg-black shadow-sm">
                            {heading}
                        </div>
                    )}
                    {items.map((item, index) => (
                        <DropdownItem
                            key={index}
                            href={item.href}
                            onClick={item.onClick}
                            className={item.className}
                            icon={item.icon}
                            description={item.description}
                        >
                            {item.label}
                        </DropdownItem>
                    ))}
                </div>
            </MenuItems>
        </Menu>
    );
}

export { Dropdown, DropdownItem };
