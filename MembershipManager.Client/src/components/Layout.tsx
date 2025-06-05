import { AppShell, Burger, Group, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Header from "./Header";

type Props = {
	title?: string;
	children: React.ReactNode;
};

const Layout = ({ title, children }: Props) => {
	const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 300,
				breakpoint: "sm",
				collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
			}}
			padding="md"
		>
			<AppShell.Header>
				{/*<Group
					h="100%"
					px="md"
				>
					<Burger
						opened={mobileOpened}
						onClick={toggleMobile}
						hiddenFrom="sm"
						size="sm"
					/>
					<Burger
						opened={desktopOpened}
						onClick={toggleDesktop}
						visibleFrom="sm"
						size="sm"
					/>
					{title}
				</Group>}</AppShell>*/}
				<Header />
			</AppShell.Header>
			<AppShell.Navbar p="md">
				Navbar
				{Array(15)
					.fill(0)
					.map((_, index) => (
						<Skeleton
							key={index}
							h={28}
							mt="sm"
							animate={false}
						/>
					))}
			</AppShell.Navbar>
			<AppShell.Main>{children}</AppShell.Main>
		</AppShell>
		/*<>
            {!title ? null : <title>{title}</title>}
            <Meta/>
            <Header/>
            <div className="min-h-screen">
                <main role="main">
                    {children}
                </main>
            </div>
            <Footer/>
        </>*/
	);
};

export default Layout;
