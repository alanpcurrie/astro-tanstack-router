import { useTheme } from "@fluentui/react";
import { makeStyles, tokens } from "@fluentui/react-components";
import {
	Accordion,
	AccordionItem,
	Button,
	Card,
	CardFooter,
	CardHeader,
	Checkbox,
	Dialog,
	DialogContent,
	DialogSurface,
	DialogTitle,
	DialogTrigger,
	Dropdown,
	Input,
	Menu,
	MenuItem,
	MenuList,
	MenuTrigger,
	Option,
	ProgressBar,
	Radio,
	RadioGroup,
	Slider,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Text,
	ToggleButton,
	Tooltip,
} from "@fluentui/react-components";
import React, { type SetStateAction } from "react";

const useStyles = makeStyles({
	root: { display: "flex" },
	rootPrimary: { color: tokens.colorBrandBackground },
});

const System = () => {
	const [isToggled, setIsToggled] = React.useState(false);
	const [selectedValue, setSelectedValue] = React.useState("");
	const [sliderValue, setSliderValue] = React.useState(50);
	const [inputValue, setInputValue] = React.useState("");
	const theme = useTheme();

	console.log("theme", theme);
	const classes = useStyles();
	console.log("clases", classes.root, classes.rootPrimary);

	return (
		<div style={{ padding: "20px" }}>
			<Card style={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}>
				<CardHeader
					header={<Text weight="bold">System Overview</Text>}
					description="Here's a quick look at your system's status."
				/>

				<Text block style={{ marginBottom: "10px" }}>
					Everything is functioning smoothly!
				</Text>

				{/* Toggle Button Example */}
				<div style={{ marginBottom: "15px" }}>
					<ToggleButton
						checked={isToggled}
						onClick={() => setIsToggled(!isToggled)}
						appearance="primary"
					>
						{isToggled ? "System Enabled" : "System Disabled"}
					</ToggleButton>
				</div>

				{/* Dropdown Example */}
				<div style={{ marginBottom: "15px" }}>
					<Dropdown
						placeholder="Select an option"
						selectedOptions={[selectedValue]}
						onOptionSelect={(_event, data) =>
							setSelectedValue(data?.optionValue as SetStateAction<string>)
						}
					>
						<Option key="normal">Normal Operation</Option>
						<Option key="maintenance">Maintenance Mode</Option>
						<Option key="offline">Offline</Option>
					</Dropdown>
				</div>

				{/* Slider Example */}
				<div style={{ marginBottom: "15px" }}>
					<Slider
						value={sliderValue}
						onChange={(_, value) =>
							setSliderValue(value as unknown as SetStateAction<number>)
						}
						min={0}
						max={100}
					/>
				</div>

				{/* Input Field Example */}
				<div style={{ marginBottom: "15px" }}>
					<Input
						placeholder="Enter system command"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
				</div>

				{/* Checkbox Example */}
				<div style={{ marginBottom: "15px" }}>
					<Checkbox label="Enable advanced diagnostics" />
				</div>

				{/* Radio Group Example */}
				<div style={{ marginBottom: "15px" }}>
					<RadioGroup defaultValue="low">
						<Radio value="low" label="Low Priority" />
						<Radio value="medium" label="Medium Priority" />
						<Radio value="high" label="High Priority" />
					</RadioGroup>
				</div>

				{/* Spinner Example */}
				<div style={{ marginBottom: "15px" }}>
					<Text block>Checking System Status...</Text>
					<Spinner />
				</div>

				{/* Dialog Example */}
				<div style={{ marginBottom: "15px" }}>
					<Dialog>
						<DialogTrigger disableButtonEnhancement>
							<Button>Open System Info</Button>
						</DialogTrigger>
						<DialogSurface>
							<DialogTitle>System Information</DialogTitle>
							<DialogContent>
								<Text>
									This system is running in stable mode with no issues detected.
								</Text>
							</DialogContent>
						</DialogSurface>
					</Dialog>
				</div>

				{/* Table Example */}
				<div style={{ marginBottom: "15px" }}>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>Component</TableCell>
								<TableCell>Status</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>CPU</TableCell>
								<TableCell>Operational</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Memory</TableCell>
								<TableCell>Healthy</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>

				{/* Menu Example */}
				<div style={{ marginBottom: "15px" }}>
					<Menu>
						<MenuTrigger disableButtonEnhancement>
							<Button>Open Menu</Button>
						</MenuTrigger>
						<MenuList>
							<MenuItem>Restart System</MenuItem>
							<MenuItem>Run Diagnostics</MenuItem>
							<MenuItem>Shut Down</MenuItem>
						</MenuList>
					</Menu>
				</div>

				{/* Tooltip Example */}
				<div style={{ marginBottom: "15px" }}>
					<Tooltip
						content="Click to submit system commands"
						relationship={"label"}
					>
						<Button>Submit Command</Button>
					</Tooltip>
				</div>

				{/* Accordion Example */}
				<div style={{ marginBottom: "15px" }}>
					<Accordion>
						<AccordionItem value="maintenance" title="Maintenance Logs">
							<Text>Maintenance completed successfully last week.</Text>
						</AccordionItem>
						<AccordionItem value="updates" title="System Updates">
							<Text>System updated to version 1.2.3.</Text>
						</AccordionItem>
					</Accordion>
				</div>

				{/* Progress Bar Example */}
				<div style={{ marginBottom: "15px" }}>
					<ProgressBar thickness="large" value={sliderValue / 100} />
				</div>

				<CardFooter>
					<Button appearance="primary" style={{ marginRight: "10px" }}>
						Take Action
					</Button>
					<Button appearance="secondary">Cancel</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default System;
