import { Dialog, Transition } from "@headlessui/react";
import { Button, IconPlus, IconX, Select } from "@supabase/ui";
import { Fragment, useCallback, useState } from "react";
import { client } from "src/libs/supabase";

type Props = {
  userData: any;
  uuid: string;
  getItemList: (year: number, month: number) => void;
};
const d = new Date();

const year = d.getFullYear();
const month = d.getMonth() + 1;
const day = d.getDate();
const hours = d.getHours();

export const AddItem = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [value, setValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  };

  //モーダルを開く
  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  //モーダルを閉める
  const closeModal = useCallback(() => {
    setPrice("");
    setDescription("");
    setIsOpen(false);
  }, []);

  //商品の追加
  const handleAdd = useCallback(
    async (value) => {
      if (price === "") {
        alert("Priceが空です");
        return;
      }

      if (value === "") {
        alert("カテゴリーを選択してください");
        return;
      }

      const buyDate = [
        year.toString(),
        month.toString(),
        day.toString(),
        hours.toString(),
      ];

      const date = [
        `year:${year.toString()}`,
        `month:${month.toString()}`,
        `day:${day.toString()}`,
      ];

      const { data, error } = await client.from("purchasedItem").insert([
        {
          userID: props.uuid,
          categoryID: value,
          price: price,
          description: description,
          buyDate: buyDate,
          date: date,
        },
      ]);
      if (error) {
        alert(error);
      } else {
        if (data) {
          props.getItemList(year, month);
          closeModal();
        }
      }
    },
    [price, props, description, closeModal]
  );

  return (
    <>
      <button
        className="block p-2 py-2 my-4 mx-auto w-32 text-center bg-gradient-to-r from-green-300 to-yellow-300 rounded-2xl border border-yellow-500 cursor-pointer"
        onClick={openModal}
      >
        登録
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="overflow-y-auto fixed inset-0 z-50"
          onClose={closeModal}
        >
          <div className="px-4 text-center border-2">
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block overflow-hidden p-6 my-8 w-full max-w-md text-left align-middle bg-gray-50 rounded-xl border border-gray-300 shadow-xl transition-all transform">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-medium leading-6 text-center text-gray-900"
                >
                  商品追加
                </Dialog.Title>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className="col-span-1 pt-1 text-xl text-center">
                    価格
                  </div>
                  <input
                    className="col-span-3 p-2 w-full h-10 bg-white rounded border border-gray-300 hover:border-gray-700 shadow appearance-none"
                    value={price}
                    type="number"
                    autoFocus
                    min={1}
                    onChange={(e) => {
                      return setPrice(e.target.value);
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className="col-span-1 pt-1 text-xl text-center">
                    説明
                  </div>
                  <input
                    className="col-span-3 p-2 w-full h-10 bg-white rounded border border-gray-300 hover:border-gray-700 shadow appearance-none"
                    value={description}
                    onChange={(e) => {
                      return setDescription(e.target.value);
                    }}
                  />
                </div>
                {/* <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className="col-span-1 pt-1 text-xl text-center">
                    日付
                  </div>
                  <input
                    className="col-span-3 p-2 w-full h-10 bg-white rounded border border-gray-300 hover:border-gray-700 shadow appearance-none"
                    value={description}
                    onChange={(e) => {
                      return setDescription(e.target.value);
                    }}
                  />
                </div> */}
                <Select label="カテゴリー" onChange={handleChange}>
                  {props.userData?.categoryList?.map((value: string) => {
                    return (
                      <Select.Option value={value} key={value}>
                        {value}
                      </Select.Option>
                    );
                  })}
                </Select>
                <div className="flex justify-center mt-4">
                  <div className="p-2 w-32">
                    <Button
                      block
                      type="default"
                      size="large"
                      icon={<IconX />}
                      onClick={closeModal}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="p-2 w-32">
                    <Button
                      block
                      size="large"
                      icon={<IconPlus />}
                      onClick={() => {
                        return handleAdd(value);
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
