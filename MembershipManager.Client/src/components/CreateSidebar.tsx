import { ErrorSummary, SelectInput, TextInput } from "@/components/Form"
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { useClient } from "@/gateway.ts";
import { Sheet } from "@/components/ui/sheet";
import { ChangeEvent, FormEvent, JSX, useState } from "react";
import { ApiContext } from "@/components/Form"
import { Button } from "@/components/ui/button.tsx";
import { CreateSidebarOptions, InputType } from "@/types";
import { IdResponse, IReturn } from "@/dtos";

type Props = {
    options: CreateSidebarOptions
    open: boolean
    onDone: () => void
    onSave?: () => void
}

function createSidebar({options, open, onDone, onSave}: Props): JSX.Element {
    const client = useClient()
    const { loading, clearErrors } = client

    const newInstance = options.createInstance
    const [request, setRequest] = useState(newInstance())

    function close() {
        setRequest(newInstance())
        clearErrors()
        onDone()
    }
    async function onSubmit(e:FormEvent<HTMLFormElement>) {
        e.preventDefault()
        await save()
    }
    async function save() {
        const api = await client.api(request)
        if (api.succeeded) {
            setRequest(newInstance);
            (onSave ?? onDone)()
        }
    }
    function change(f: (dto: IReturn<IdResponse>, value: string) => void) {
        return (e : ChangeEvent<HTMLInputElement>) => {
            f(request, e.target.value)
            setRequest(options.createDto(request))
        }
    }

    return (<ApiContext.Provider value={client}>
        <Sheet open={open} onOpenChange={close}>
            <SheetContent className="w-screen xl:max-w-3xl md:max-w-xl max-w-lg">
                <SheetHeader>
                    <SheetTitle>New {options.typeName}</SheetTitle>
                </SheetHeader>
                <form className="grid gap-4 py-4" onSubmit={onSubmit}>
                    <input className="hidden" type="submit"/>
                    <fieldset disabled={loading}>
                        <ErrorSummary except={options.visibleFields} className="mb-4" />
                        <div className="grid grid-cols-6 gap-6">
                            {options.inputs.map((input) => (
                                 <div className="col-span-6 sm:col-span-3">
                                    {(() => {
                                        switch (input.type) {
                                            case InputType.NumberInput:
                                                return (
                                                    <TextInput id={input.id} 
                                                            type="number"  
                                                            min={input.min} 
                                                            required={input.required}
                                                            defaultValue={input.value}
                                                            onChange={change(input.onChange)} />
                                                )
                                            case InputType.Select:
                                                return (
                                                    <SelectInput id={input.id} 
                                                            options={input.options} 
                                                            value={input.value(request)} 
                                                            onChange={change(input.onChange)} />
                                                )
                                        }
                                    })()}
                                </div>
                            ))}
                        </div>
                    </fieldset>
                </form>
                <SheetFooter>
                    <div
                        className="w-full absolute bottom-0 left-0 border-gray-200 dark:border-gray-700 border-t mt-4 px-4 py-3 bg-gray-50 dark:bg-gray-900 sm:px-6 flex flex-wrap justify-between">
                        <div>
                        </div>
                        <div></div>
                        <div className="flex justify-end">
                            <Button variant="outline" onClick={close}>Cancel</Button>
                            <Button className="ml-4" disabled={loading} onClick={save}>Save</Button>
                        </div>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    </ApiContext.Provider>)
}

export default createSidebar