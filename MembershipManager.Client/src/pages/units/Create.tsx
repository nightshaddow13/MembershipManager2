import { ErrorSummary, SelectInput, TextAreaInput, TextInput } from "@/components/Form"
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { CreateUnit, Sex, UnitType } from "@/dtos";
import { useApp, useClient } from "@/gateway.ts";
import { Sheet } from "@/components/ui/sheet";
import { ChangeEvent, FormEvent, useState } from "react";
import { ApiContext } from "@/components/Form"
import { Button } from "@/components/ui/button.tsx";
import SrcPage from "@/components/SrcPage.tsx";

type Props = {
    open: boolean
    onDone: () => void
    onSave?: () => void
}

export default ({open, onDone, onSave}: Props) => {
    const visibleFields = "district,sex,type,number"

    const app = useApp()
    const client = useClient()
    const { loading, clearErrors } = client

    const newUnit = () => new CreateUnit({
        districtId: 1
    })
    const [request, setRequest] = useState(newUnit())

    function close() {
        setRequest(newUnit())
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
            setRequest(newUnit);
            (onSave ?? onDone)()
        }
    }
    function change(f: (dto: CreateUnit, value: string) => void) {
        return (e : ChangeEvent<HTMLInputElement>) => {
            f(request, e.target.value)
            setRequest(new CreateUnit(request))
        }
    }

    return (<ApiContext.Provider value={client}>
        <Sheet open={open} onOpenChange={close}>
            <SheetContent className="w-screen xl:max-w-3xl md:max-w-xl max-w-lg">
                <SheetHeader>
                    <SheetTitle>New Unit</SheetTitle>
                </SheetHeader>
                <form className="grid gap-4 py-4" onSubmit={onSubmit}>
                    <input className="hidden" type="submit"/>
                    <fieldset disabled={loading}>
                        <ErrorSummary except={visibleFields} className="mb-4" />
                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                                <SelectInput id="sex" options={app.enumOptions('Sex')} 
                                             value={request.sex} 
                                             onChange={change((x, value) => x.sex = value as Sex)}/>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <SelectInput id="type" options={app.enumOptions('UnitType')} 
                                             value={request.type} 
                                             onChange={change((x, value) => x.type = value as UnitType)}/>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <TextInput id="number" type="number"  min="0" required
                                           defaultValue={request.number}
                                           onChange={change((x, value) => x.number = Number(value))}/>
                            </div>
                        </div>
                    </fieldset>
                    <div className="flex justify-center">
                        <SrcPage path="units-crud/Create.tsx"/>
                    </div>
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